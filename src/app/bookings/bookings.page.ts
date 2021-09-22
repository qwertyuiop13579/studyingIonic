import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingsService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[];
  private bookingSubscription;

  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.bookingSubscription = this.bookingsService.bookings.subscribe((bookingsArr) => {
      this.bookings = bookingsArr;
    });
  }

  onCancelBooking(bookingId, slidingItem: IonItemSliding) {
    slidingItem.close();
    // cancel booking
  }
  ngOnDestroy() {
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }

}
