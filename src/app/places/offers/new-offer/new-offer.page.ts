/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable object-shorthand */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { PlaceLocation } from '../../location.model';
import { PlacesService } from '../../places.service';

export function base64toBlob(base64Data, contentType) {     //convert Base64 to blob
  contentType = contentType || '';
  const sliceSize = 1024;
  //const byteCharacters = atob(base64Data);
  const byteCharacters = URL.createObjectURL(new Blob([base64Data], { type: 'text/plain' }));  // the error was with atob() function
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      description: new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] }),
      price: new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.min(1)] }),
      dateFrom: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      dateTo: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      location: new FormControl(null, { validators: [] }),
      image: new FormControl(null, { validators: [] }),
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });
  }

  onImagePicked(imageData: string | File) {           //error
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    }
    else {
      imageFile = imageData;
    }
    //console.log(imageFile);      //return image
    this.form.patchValue({ image: imageFile });
  }

  onCreateOffer() {
    if (this.form.invalid || !this.form.get('image').value) {
      return;
    }
    //console.log(this.form.value);
    this.loadingCtrl.create({
      message: 'Creating new place...'
    }).then(loadingEl => {
      loadingEl.present();
      //need to upload image to get imageURL
      // this.placesService.uploadImage(this.form.get('image').value).pipe(switchMap((uploadRes) => {
      //   return this.placesService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price,
      //     new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo), this.form.value.location, uploadRes.imageURL);
      //     // Error with uploadRes.imageURL
      // }))
      //this.placesService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price, new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo), this.form.value.location, this.form.get('image').value)
      this.placesService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price,
         new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo), this.form.value.location,
          //this.form.value.location.staticMapImageURL)
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGxhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80')
      .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        }, (error) => {
          console.log(error);
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        });
    });
  }
}
