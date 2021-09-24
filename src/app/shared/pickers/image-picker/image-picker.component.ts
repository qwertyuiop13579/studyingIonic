import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filepicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  selectedImage: string;
  canUsePicker = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('Mobile: ' + this.platform.is('mobile'));
    console.log('Hybrid: ' + this.platform.is('hybrid'));
    console.log('Ios: ' + this.platform.is('ios'));
    console.log('Android: ' + this.platform.is('android'));
    console.log('Desktop: ' + this.platform.is('desktop'));
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || (this.platform.is('desktop'))) {
      this.canUsePicker = true;
    }
  }

  async onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera') || this.canUsePicker) {
      console.log('Camera is not available.');
      this.filePickerRef.nativeElement.click();
      return;
    }
    console.log('Camera is available.');
    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      console.log('Image is available.');
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
      console.log(image);
    }).catch((error) => {
      console.log(error);
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataURL = fr.result.toString();
      this.selectedImage = dataURL;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
