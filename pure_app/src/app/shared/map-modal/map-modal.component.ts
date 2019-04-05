import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import * as map from 'mapbox-gl';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  lat;
  lng;
  input: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    
    // initial get the lat long for the current location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(pos => {
        this.lat = pos.coords.latitude + 2;
        this.lng = pos.coords.longitude + 1;
        console.log(this.lat, this.lng);
      });
    }
  }

  onCancel() {
    // console.log('close');
    this.modalCtrl.dismiss();
  }

  run() {
    if (!this.input) {
      return;
    }
    console.log(this.input);
  }
}
