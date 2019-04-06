import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ModalController} from '@ionic/angular';

import {MapModalComponent} from './../../map-modal/map-modal.component';
import {Location} from './../../location.modal';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}
  @Output() location = new EventEmitter<Location>();

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        this.location.emit(resultData);
      });
    // console.log('modal open');
    // recieve data [lat, lng]
  }
}
