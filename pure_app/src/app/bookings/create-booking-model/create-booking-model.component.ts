import {Component, OnInit, Input} from '@angular/core';
import {Place} from 'src/app/places/place.model';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-create-booking-model',
  templateUrl: './create-booking-model.component.html',
  styleUrls: ['./create-booking-model.component.scss'],
})
export class CreateBookingModelComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
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
    this.modalCtrl.dismiss(
      {
        message: 'This is a dummy message!',
      },
      'confirm'
    );
  }
}
