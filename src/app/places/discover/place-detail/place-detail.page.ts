import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BookingsService } from '../../../bookings/booking.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placesSubscription: Subscription;

  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSubscription = this.placesService.getPlace(paramMap.get('placeId')).subscribe((place) => {
        this.place = place;
      });
      // this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });

  }

  onBookPlace() {
    //this.router.navigate(['/places/tabs/discover']);
    //this.navCtrl.pop();
    //this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'destructive',
        },
      ]
    }).then(actionEl => {
      actionEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode,
      }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl.create({ message: 'Booking place...' }).then(loadindEl => {
            loadindEl.present();
            const data = resultData.data.bookingData;
            this.bookingService.addBooking(this.place.id, this.place.title, this.place.imageURL,
              data.firstName, data.lastName, data.guestsNumber, data.dateFrom,
              data.dateTo).subscribe(() => {
                loadindEl.dismiss();
              });
          });
        }
      });
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }

}
