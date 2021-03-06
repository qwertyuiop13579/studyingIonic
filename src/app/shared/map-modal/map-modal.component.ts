/* eslint-disable max-len */
/* eslint-disable object-shorthand */
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Coordinates } from 'src/app/places/location.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapElement: ElementRef;
  @Input() center: Coordinates = { lat: -34.397, lng: 150.644 };
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickLictener: any;
  googleMaps: any;


  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElement.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 8,
      });
      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      if (this.selectable) {
        this.clickLictener = map.addListener('click', event => {
          const selectedCoords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          this.modalCtrl.dismiss(selectedCoords);
        });
      }
      else {
        const marker = new googleMaps.Marker({ position: this.center, map: map, title: 'Picked Location' });
        marker.setMap(map);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.googleMaps && this.googleMaps.event && this.clickLictener) {
      this.googleMaps.event.removeListener(this.clickLictener);
    }
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule);
        }
        else {
          reject('Google maps SDK is not available.');
        }
      };
    });
  }

}
