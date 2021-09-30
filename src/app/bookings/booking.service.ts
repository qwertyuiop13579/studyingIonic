/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookingData {
  dateFrom: string;
  dateTo: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  userId: string;
}


@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private bookingsSubj = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this.bookingsSubj.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  addBooking(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestsNumber: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    let newBooking: Booking;
    return this.authService.userId.pipe(take(1), switchMap((userId) => {
      if (!userId) {
        throw new Error('No user id found.');
      }
      else {
        newBooking = new Booking(Math.random().toString(), placeId, userId, placeTitle, placeImage, firstName, lastName, guestsNumber, dateFrom, dateTo);
      }
      return this.http.post<{ name: string }>('https://studyingionic-83d58-default-rtdb.firebaseio.com/bookings.json', { ...newBooking, id: null });
    }), switchMap((resData) => {
      generatedId = resData.name;
      return this.bookings;
    }),
      take(1),
      tap((bookArr) => {
        newBooking.id = generatedId;
        this.bookingsSubj.next(bookArr.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(`https://studyingionic-83d58-default-rtdb.firebaseio.com/bookings/${bookingId}.json`).pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap((bookingsArr) => {
        this.bookingsSubj.next(bookingsArr.filter(book => book.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    return this.authService.userId.pipe(take(1), switchMap((userId) => {
      if (!userId) {
        throw new Error('Caanot find user id.');
      }
      return this.http.get<{ [key: string]: BookingData }>(`https://studyingionic-83d58-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`);
    }),
      map((resData) => {
        const bookings: Booking[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const resDataByKey = resData[key];
            bookings.push(new Booking(key, resDataByKey.placeId, resDataByKey.userId, resDataByKey.placeTitle, resDataByKey.placeImage,
              resDataByKey.firstName, resDataByKey.lastName, resDataByKey.guestNumber, new Date(resDataByKey.dateFrom), new Date(resDataByKey.dateTo)));
          }
        }
        return bookings;
      }),
      tap(bookArr => {
        this.bookingsSubj.next(bookArr);
      }));
  }
}
