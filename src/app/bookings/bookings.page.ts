import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingsService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[];
  isLoading = false;
  private bookingSubscription: Subscription;

  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.bookingSubscription = this.bookingsService.bookings.subscribe((bookingsArr) => {
      console.log(bookingsArr);
      this.bookings = bookingsArr;
      //this.cdRef.detectChanges();

      //markforCheck
      //booking$
    });
    // this.isLoading = true;
    // this.bookingsService.fetchBookings().subscribe(() => {
    //   this.isLoading = false;
    // });
  }

  // ionViewWillEnter() {
  //   this.isLoading = true;
  //   this.bookingsService.fetchBookings().subscribe(() => {
  //     this.isLoading = false;
  //   });
  // }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({ message: 'Canceling booking...' }).then((loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
        //this.cdRef.markForCheck();
        this.isLoading = true;
        this.bookingsService.fetchBookings().subscribe(() => {
          this.isLoading = false;
        });
      });
    }));
  }

  ngOnDestroy() {
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }

  get printMessage() {
    console.log('Bookings page render');
    return true;
  }

}
