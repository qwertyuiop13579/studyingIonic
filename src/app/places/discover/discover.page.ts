import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  places: Place[] = [];
  private placesSebscription: Subscription;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSebscription = this.placesService.places.subscribe((placesArr) => {
      this.places = placesArr;
    });
  }

  // ionViewWillEnter() {
  //   this.places = this.placesService.places;
  // }

  onSegmentsChange(event: any) {
    console.log(event.detail);
  }

  ngOnDestroy() {
    if (this.placesSebscription) {
      this.placesSebscription.unsubscribe();
    }
  }
}
