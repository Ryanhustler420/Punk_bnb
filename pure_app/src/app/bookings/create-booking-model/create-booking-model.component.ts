import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Place} from 'src/app/places/place.model';
import {ModalController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-create-booking-model',
  templateUrl: './create-booking-model.component.html',
  styleUrls: ['./create-booking-model.component.scss'],
})
export class CreateBookingModelComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableFrom);
    if (this.selectedMode === 'random') {
      const _sdate =
        availableFrom.getTime() +
        Math.random() *
          (availableTo.getTime() -
            7 * 24 * 60 * 60 * 1000 -
            availableFrom.getTime());
      this.startDate = new Date(_sdate).toISOString();

      const _edate =
        _sdate + Math.random() * (_sdate + 6 * 24 * 60 * 60 * 1000 - _sdate);

      this.endDate = new Date(_edate).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: this.form.value['guest-number'],
          startDate: this.form.value['date-from'],
          endDate: this.form.value['date-to'],
        },
      },
      'confirm'
    );
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);

    return endDate > startDate;
  }
}
