import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';

import {MapModalComponent} from './../../map-modal/map-modal.component';
import {Location} from './../../location.modal';
import {Plugins, Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private actionSheet: ActionSheetController,
    private alertCtrl: AlertController
  ) {}
  @Output() location = new EventEmitter<Location>();

  ngOnInit() {}

  onPickLocation() {
    this.actionSheet
      .create({
        header: 'Choose Actions',
        buttons: [
          {
            text: 'Current Location',
            handler: () => {
              this.getCurrentLocation();
            },
          },
          {
            text: 'Pick in Map',
            handler: () => {
              this.openMapDialog();
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then(actionEl => {
        actionEl.present();
      });
  }

  getCurrentLocation() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.alertErr();
      return;
    }
    Plugins.Geolocation.getCurrentPosition()
      .then(geoPos => {
        this.emitLatLng(geoPos.coords.latitude, geoPos.coords.longitude);
      })
      .catch(err => this.alertErr());
  }

  alertErr() {
    this.alertCtrl
      .create({
        header: 'Location Fetching Error',
        message: 'You Should Check Your Internet Connection',
      })
      .then(el => {
        el.present();
      });
  }

  openMapDialog() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        this.emitLatLng(resultData.data.lat, resultData.data.lng);
      });
  }

  emitLatLng(lat: number, lng: number) {
    this.location.emit({lat, lng});
  }
}
