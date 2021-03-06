/* eslint-disable max-len */
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: string;
  @ViewChild('f', { static: true }) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
    else {
      this.startDate = new Date().toISOString();
      this.endDate = new Date().toISOString();
    }
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid()) {
      return;
    }

    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guestsNumber: +this.form.value['guests-number'],
        dateFrom: new Date(this.form.value['date-from']),
        dateTo: new Date(this.form.value['date-to']),
      }
    }, 'confirm');
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');        //close the nearest modal
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }

  // get printMessage() {
  //   console.log('Create-booking rerender');
  //   return true;
  // }

}
