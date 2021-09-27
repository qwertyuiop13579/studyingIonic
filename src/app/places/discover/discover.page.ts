/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
  isLoading = false;
  private placesSubscription: Subscription;

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe(placesArr => {
      this.loadedPlaces = [...placesArr];
      this.relevantPlaces = [...placesArr];
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onSegmentsChange(event: any) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all-places') {
        this.relevantPlaces = [...this.loadedPlaces];
      } else {

        this.relevantPlaces = this.loadedPlaces.filter((place) => {
          return place.userId !== userId;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
