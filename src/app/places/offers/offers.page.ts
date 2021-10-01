import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersPage implements OnInit, OnDestroy {
  @Input() items: Observable<Place[]>;
  offers: Place[];
  isLoading = false;
  private placesSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe((placesArr) => {
      this.offers = placesArr;          //when array changes, angular do not know about this, so we need to use markForCheck();
      //console.log(this.offers);
      this.cdRef.markForCheck();
    });
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({ message: 'Deleting offer...' }).then((loadingEl => {
      loadingEl.present();
      this.placesService.deletePlace(offerId).subscribe((placesArr) => {
        loadingEl.dismiss();
      });
    }));
  }

  ngOnDestroy() {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }

}
