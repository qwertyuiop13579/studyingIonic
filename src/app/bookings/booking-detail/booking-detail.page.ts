import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Booking } from '../booking.model';
import { BookingsService } from '../booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  booking: Booking;
  isLoading = false;

  constructor(private bookingService: BookingsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('bookingId')) {
        this.navCtrl.navigateBack('/bookings');
        return;
      }
      this.isLoading = true;
      this.bookingService.getBooking(paramMap.get('bookingId')).subscribe((booking) => {
        this.booking = booking;
        this.isLoading = false;
      }, (error) => {
        console.log(error);
        this.isLoading = false;
      });
    });
  }
}
