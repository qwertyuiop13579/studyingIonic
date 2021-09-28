/* eslint-disable object-shorthand */
/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from '../../../places/location.model';
import { of } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPicked = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string;
  isLoading = false;


  constructor(private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) { }

  ngOnInit() { }

  onPickLocation() {
    this.actionSheetCtrl.create({
      header: 'Choose option to locate', buttons: [
        {
          text: 'Pick on Google Maps',
          handler: () => {
            this.openMapModal();
          }
        },
        {
          text: 'Auto Locate',
          handler: () => {
            this.locateUser();
          }
        },
        {
          text: 'Cancel',
          role: 'destructive',
        },
      ]
    }).then((actionEl) => { actionEl.present(); });
  }

  private openMapModal() {
    this.modalCtrl.create({
      component: MapModalComponent,
    })
      .then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
        modalEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition().then((geoPosition) => {
      const coordinates: Coordinates = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
      this.createPlace(coordinates.lat, coordinates.lng);
      console.log('Current postion: ' + coordinates.lat + ' ' + coordinates.lng);
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }

  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch your location',
      message: 'Please use the map to pick a location!',
      buttons: ['Ok']
    }).then((alertEl) => {
      alertEl.present();
    });

  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageURL: null,
    };
    this.isLoading = true;
    this.getAddress(lat, lng).pipe(switchMap((address) => {
      pickedLocation.address = address;
      return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
    })).subscribe((staticMapImageURL) => {
      pickedLocation.staticMapImageURL = staticMapImageURL;
      this.selectedLocationImage = staticMapImageURL;
      this.isLoading = false;
      this.locationPicked.emit(pickedLocation);
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`)
      .pipe(map((geoData: any) => {
        if (!geoData || !geoData.results || geoData.results.length === 0) {
          return null;
        }
        return geoData.results[0].formatted_address;
      }));
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    if (environment.googleMapsAPIKey === 'My-key') {
      console.log('Use Static Google Map image');
      return 'https://i.stack.imgur.com/HILmr.png';
    }
    else {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
    }
  }
}
