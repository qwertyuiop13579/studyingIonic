/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';
import { Place } from './place.model';


// new Place('pl1', 'title1', 'description1', 'https://www.pandotrip.com/wp-content/uploads/2018/06/Eiffel-Tower-Paris-France.jpg', 10, new Date('2021-10-01'), new Date('2022-10-01'), 'user1'),
// new Place('pl2', 'title2', 'description2', 'https://media.gettyimages.com/photos/the-statue-of-liberty-with-world-trade-center-background-landmarks-of-picture-id1059614218?s=612x612', 15, new Date('2021-10-01'), new Date('2022-10-01'), 'user2'),
// new Place('pl3', 'title3', 'description3', 'https://image.shutterstock.com/image-photo/street-white-houses-colonia-shown-260nw-1035199813.jpg', 20, new Date('2021-10-01'), new Date('2022-10-01'), 'user3'),

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageURL: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private placesSubj = new BehaviorSubject<Place[]>([]);

  get places() {
    return this.placesSubj.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://studyingionic-83d58-default-rtdb.firebaseio.com/places.json')
      .pipe(
        map((resData => {
          const placesArr = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const resDataByKey = resData[key];
              placesArr.push(new Place(key, resDataByKey.title, resDataByKey.description, resDataByKey.imageURL, resDataByKey.price,
                new Date(resDataByKey.availableFrom), new Date(resDataByKey.availableTo), resDataByKey.userId, resDataByKey.location));
            }
          }
          return placesArr;
          //return [];
        })),
        tap((places) => {
          this.placesSubj.next(places);
        }),
      );
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://studyingionic-83d58-default-rtdb.firebaseio.com/places/${id}.json`).pipe(
      map((resData) => {
        return new Place(id, resData.title, resData.description, resData.imageURL, resData.price,
          new Date(resData.availableFrom), new Date(resData.availableTo), resData.userId, resData.location);
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    const newPlace = new Place(Math.random.toString(), title, description,
      'https://www.pandotrip.com/wp-content/uploads/2018/06/Eiffel-Tower-Paris-France.jpg', price, dateFrom, dateTo,
      this.authService.userId, location);
    let generatedId: string;
    return this.http.post<{ name: string }>('https://studyingionic-83d58-default-rtdb.firebaseio.com/places.json', { ...newPlace, id: null })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((placesArr) => {
          newPlace.id = generatedId;
          this.placesSubj.next(placesArr.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((placesArr) => {
        if (!placesArr || placesArr.length <= 0) {
          return this.fetchPlaces();
        }
        else {
          return of(placesArr);
        }
      }),
      switchMap((placesArr) => {
        const updatedPlaceIndex = placesArr.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...placesArr];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id, title, description, oldPlace.imageURL, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId, oldPlace.location);
        return this.http.put(`https://studyingionic-83d58-default-rtdb.firebaseio.com/places/${placeId}.json`, { ...updatedPlaces[updatedPlaceIndex], id: null });
      }),
      tap(() => { this.placesSubj.next(updatedPlaces); }));
  }

}
