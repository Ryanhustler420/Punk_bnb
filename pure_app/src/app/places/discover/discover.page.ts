import {Component, OnInit, OnDestroy} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {SegmentChangeEventDetail} from '@ionic/core';
import {Subscription} from 'rxjs';
import {AuthService} from './../../auth/auth.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub: Subscription;
  isLoading = false;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.populateData();
    this.placesSub = this.placesService.allPlaces.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onFilterUpdate(e: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (e.detail.value === 'all') {
        this.relevantPlaces = this.loadedPlaces;
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(
          place => place.userId !== userId
        );
      }
      this.listedLoadedPlaces = this.relevantPlaces
        ? this.relevantPlaces.slice(1)
        : [];
    });
  }
}
