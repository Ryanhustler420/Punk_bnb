import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PlacesService} from '../../places.service';
import {Location} from './../../../shared/location.modal';
import Map from 'mapbox-gl';
import {MapService} from './../../../map/map.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  lat = 0;
  lng = 0;
  isSelectedLocation = false;

  constructor(
    private placeService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  onImagePicked(e: string) {
    console.log(e);
  }

  ionViewWillEnter() {
    this.isSelectedLocation = false;
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Creating place...',
      })
      .then(loadingEl => {
        loadingEl.present();
        this.placeService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo),
            this.form.value.location
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.mapService.resetLocationSubject();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }

  setLocationLatLng(e: Location) {
    this.isSelectedLocation = true;
    (this.lat = e.lat), (this.lng = e.lng);
    this.form.patchValue({location: e});
  }
}
