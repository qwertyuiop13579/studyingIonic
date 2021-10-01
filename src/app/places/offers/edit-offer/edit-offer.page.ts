/* eslint-disable max-len */
/* eslint-disable object-shorthand */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlaceLocation } from '../../location.model';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { base64toBlob } from '../new-offer/new-offer.page';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading = false;
  placeId: string;
  private placesSubscription: Subscription;

  constructor(private route: ActivatedRoute, private placesService: PlacesService, private navCtrl: NavController,
    private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSubscription = this.placesService.getPlace(this.placeId).subscribe((place) => {
        this.place = place;
        this.cdRef.markForCheck();
        this.form = new FormGroup({
          title: new FormControl(this.place.title, { validators: [Validators.required] }),
          description: new FormControl(this.place.description, { validators: [Validators.required, Validators.maxLength(180)] }),
          price: new FormControl(this.place.price, { updateOn: 'blur', validators: [Validators.required, Validators.min(1)] }),
          dateFrom: new FormControl(this.place.availableFrom.toISOString(), { updateOn: 'blur', validators: [Validators.required] }),
          dateTo: new FormControl(this.place.availableTo.toISOString(), { updateOn: 'blur', validators: [Validators.required] }),
          location: new FormControl(this.place.location.staticMapImageURL, { validators: [] }),
          image: new FormControl(this.place.imageURL, { validators: [] }),
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occured',
          message: 'Place could not be fetched. Please try again later.',
          buttons:
            [{
              text: 'Okay', handler: () => {
                this.router.navigate(['/places/tabs//offers']);
              }
            }]
        }).then((alertEl => {
          alertEl.present();
        }));
      });
    });
  }

  onEditOffer() {
    if (this.form.invalid) {
      return;
    }
    this.loadingCtrl.create({ message: 'Updating place...' }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description, this.form.value.price,
        new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo), this.form.value.location,
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGxhY2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80').subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        });
    });

  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });
  }

  onImagePicked(imageData: string | File) {
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
    this.form.patchValue({ image: imageFile });
  }


  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
