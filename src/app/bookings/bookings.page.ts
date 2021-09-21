import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingsService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: Booking[];

  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.bookings = this.bookingsService.bookings;
  }

  onCancelBooking(bookingId, slidingItem: IonItemSliding) {
    slidingItem.close();
    // cancel booking
  }

}
