import {Component, OnInit} from '@angular/core';
import {ModalController, LoadingController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';

import Map from 'mapbox-gl';
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
        this.http
          .get(
            `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              'jamshedpur'
            )}.json?access_token=${Map.accessToken}`
          )
          .subscribe(data => {
            if (data['features'].length > 0) {
              this.lng = data['features'][0].center[0];
              this.lat = data['features'][0].center[1];
              this.addressError = false;
              this.loadingCtrl.dismiss();
            } else {
              this.addressError = true;
              // redirect or error message
            }
          });
      });
    this.mapService
      .getLocation('Jamshsdsdsdedpur Jharkhand')
      .subscribe(data => {
        if (data) {
        }
      });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  run() {
    if (!this.input) {
      return;
    }
    console.log(this.input);
  }
}
