import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {IonItemSliding} from '@ionic/angular';

import {PlacesService} from './../places.service';
import {Place} from './../place.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSubs: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSubs = this.placesService.allPlaces.subscribe(places => {
      this.offers = places;
    });
  }

  ngOnDestroy() {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    // console.log('offerId', offerId);
  }
}
