/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoverPage implements OnInit, OnDestroy {

  placesSegment: string;
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoading = false;
  private placesSubscription: Subscription;

  constructor(private placesService: PlacesService, private authService: AuthService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe(placesArr => {
      this.loadedPlaces = [...placesArr];
      this.relevantPlaces = [...placesArr];
      this.cdRef.markForCheck();
    });
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ionViewWillEnter() {
    // this.isLoading = true;
    // this.placesService.fetchPlaces().subscribe(() => {
    //   this.isLoading = false;
    // });
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
