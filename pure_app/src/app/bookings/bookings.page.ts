import {Component, OnInit, OnDestroy} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSubs: Subscription;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingSubs = this.bookingService.bookings.subscribe(booking => {
      this.loadedBookings = booking;
    });
  }

  ngOnDestroy() {
    if (this.bookingSubs) {
      this.bookingSubs.unsubscribe();
    }
  }

  onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // Cancel booking with offer id
  }
}
