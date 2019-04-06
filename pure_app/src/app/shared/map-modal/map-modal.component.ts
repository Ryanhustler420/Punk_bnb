import {Component, OnInit} from '@angular/core';
import {ModalController, LoadingController} from '@ionic/angular';

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
    // private http: HttpClient,
    private mapService: MapService,
    private loadingCtrl: LoadingController
  ) {}

  // get address from lat lon
  // get current location lat long or text
  // send back lat long and address text
  // show static map
  // submit form

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Fetching Current Location...',
      })
      .then(loadingEl => {
        loadingEl.present();
        this.mapService.getCurrentLocationLatLong().subscribe(pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          this.mapService
            .getAddressTextFromLatLng(this.lat, this.lng)
            .subscribe(data => {
              this.input = (data.place_name.split(',').join(''));
            });
          this.loadingCtrl.dismiss();
        });
      })
      .catch(err => console.log(err, 'map[modalError]'));
  }

  onCancel() {
    this.modalCtrl.dismiss(
      {lat: this.lat, lng: this.lng, address: this.input},
      'Current'
    );
  }

  onDone() {
    this.modalCtrl.dismiss(
      {lat: this.lat, lng: this.lng, address: this.input},
      'Manual'
    );
  }

  run() {
    !this.input.trim()
      ? // tslint:disable-next-line:no-unused-expression
        null || 0
      : this.mapService.getLocation(this.input).subscribe(data => {
          this.addressError = false;
          if (data.length > 0) {
            (this.lat = data[0]['center'][1]),
              (this.lng = data[0]['center'][0]);
            this.mapService.moveMarker(this.lat, this.lng);
          } else {
            this.addressError = true;
          }
        });
  }
}
