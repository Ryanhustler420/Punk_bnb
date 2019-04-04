import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  lat = '40.7609177';
  lng = '-73.9896704';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    // console.log('close');
    this.modalCtrl.dismiss();
  }
}
