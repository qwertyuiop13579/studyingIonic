import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/booking.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placesSubscription: Subscription;

  constructor(private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      let currentUserId: string;
      this.authService.userId.pipe(take(1),
        switchMap((userId) => {
          if (!userId) {
            throw new Error('Cannot find user id.');
          }
          else {
            currentUserId = userId;
            return this.placesService.getPlace(paramMap.get('placeId'));
          }
        })).subscribe((place) => {
          this.place = place;
          this.isBookable = place.userId !== currentUserId;
          this.isLoading = false;
        }, (error) => {
          this.alertCtrl.create({
            header: 'An error occured!',
            message: 'Place could not be fetched. Please try again later.',
            buttons:
              [{
                text: 'Okay', handler: () => {
                  this.router.navigate(['/places/tabs//discover']);
                }
              }]
          }).then((alertEl => {
            alertEl.present();
          }));
        });
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
              data.firstName, data.lastName, data.guestsNumber, new Date(data.dateFrom),
              new Date(data.dateTo)).subscribe(() => {
                loadindEl.dismiss();
                this.router.navigate(['/places/tabs/discover']);
              });
          });
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        center: { lat: this.place.location.lat, lng: this.place.location.lng },
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address,
      }
    })
      .then(modalEl => {
        modalEl.present();
      });
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }

  // get printMessage(){
  //   console.log('place-detatil render');
  //   return true;
  // }

}
