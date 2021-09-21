/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings: Booking[] = [
    {
      id: 'bk1',
      placeId: 'pl1',
      userId: 'user1',
      placeTitle: 'title1',
      guestNumber: 10,
    }
  ];

  get bookings() {
    return [...this._bookings];
  }
  constructor() { }
}
