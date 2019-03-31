import {Component, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {MenuController} from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.populateData();
  }

  populateData() {
    this.loadedPlaces = this.placesService.allPlaces;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  ionViewWillEnter() {
    this.populateData();
  }

  onFilterUpdate(e: CustomEvent<SegmentChangeEventDetail>) {
    console.log(e.detail);
  }

  // onOpenMenu() {
  //   // this.menuCtrl.close('m1'); // open menu with id m1
  //   this.menuCtrl.toggle();
  // }
}
