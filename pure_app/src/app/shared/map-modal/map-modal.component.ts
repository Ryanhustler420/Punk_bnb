import {Component, OnInit} from '@angular/core';
import {ModalController, LoadingController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';

import {MapService} from './../../map/map.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  lat;
  lng;
  input: string;
  addressError = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private mapService: MapService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Fetching Current Location...',
      })
      .then(loadingEl => {
        loadingEl.present();
        this.mapService.getLocation('Jamshedpur Jharkhand').subscribe(data => {
          if (data) {
            this.lat = data[0]['center'][1];
            this.lng = data[0]['center'][0];
            this.addressError = false;
            this.loadingCtrl.dismiss();
          } else {
            this.addressError = true;
          }
        });
      });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  run() {
    if (!this.input) {
      return;
    }
    this.mapService.getLocation(this.input).subscribe(data => {
      if (data.length > 0) {
        this.lat = data[0]['center'][1];
        this.lng = data[0]['center'][0];
        this.addressError = false;
      } else {
        this.addressError = true;
      }
    });
  }
}
