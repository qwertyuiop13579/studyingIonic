import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private bookingsService: BookingsService,
    private loadingCtrl: LoadingController,
    private cdRef: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit() {
    this.bookingSubscription = this.bookingsService.bookings.subscribe((bookingsArr) => {
      this.bookings = bookingsArr;
      this.cdRef.markForCheck();
      //this.cdRef.detectChanges();
      //markforCheck
      //booking$
    });
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({ message: 'Canceling booking...' }).then((loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    }));
  }

  onOpenBooking(booking: Booking, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'bookings', booking.id]);
  }


  ngOnDestroy() {
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }

  // get printMessage() {
  //   console.log('Bookings page render');
  //   return true;
  // }

}
