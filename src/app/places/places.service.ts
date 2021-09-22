/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('pl1', 'title1', 'description1', 'https://www.pandotrip.com/wp-content/uploads/2018/06/Eiffel-Tower-Paris-France.jpg', 10, new Date('2021-10-01'), new Date('2022-10-01')),
    new Place('pl2', 'title2', 'description2', 'https://media.gettyimages.com/photos/the-statue-of-liberty-with-world-trade-center-background-landmarks-of-picture-id1059614218?s=612x612', 15, new Date('2021-10-01'), new Date('2022-10-01')),
    new Place('pl3', 'title3', 'description3', 'https://image.shutterstock.com/image-photo/street-white-houses-colonia-shown-260nw-1035199813.jpg', 20, new Date('2021-10-01'), new Date('2022-10-01')),
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return { ...this._places.find(p => p.id === id) };
  }

}
