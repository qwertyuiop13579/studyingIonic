/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSubscription: Subscription;

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe(placesArr => {
      this.loadedPlaces = [...placesArr];
      this.relevantPlaces = [...placesArr];
    });
  }

  onSegmentsChange(event: any) {
    if (event.detail.value === 'all-places') {
      this.relevantPlaces = [...this.loadedPlaces];
    } else {

      this.relevantPlaces = this.loadedPlaces.filter((place) => {
        return place.userId !== this.authService.userId;
      });
    }
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
