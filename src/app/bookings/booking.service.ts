/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private bookingsSubj = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this.bookingsSubj.asObservable();
  }

  constructor(private authService: AuthService) { }

  addBooking(placeId: string, placeTitle: string, placeImage: string,
    firstName: string, lastName: string, guestsNumber: number, dateFrom: Date, dateTo: Date) {
    const newBooking = new Booking(Math.random().toString(), placeId, this.authService.userId, placeTitle, placeImage, firstName,
      lastName, guestsNumber, dateFrom, dateTo);
    return this.bookings.pipe(take(1), delay(1000), tap((bookingsArr) => {
      this.bookingsSubj.next(bookingsArr.concat(newBooking));
    }));
  }

  cancelBooking(bookingId: string) {

  }
}
