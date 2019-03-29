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

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

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
