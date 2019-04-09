import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PlacesService} from '../../places.service';
import {Location} from './../../../shared/location.modal';
// import Map from 'mapbox-gl';
import {MapService} from './../../../map/map.service';

function base64toBlob(base64Data, contentType): Blob {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }

    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, {type: contentType});
}

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
      image: new FormControl(null),
    });
  }

  onImagePicked(e: string | File) {
    let imageFile;
    if (typeof e === 'string') {
      try {
        imageFile = base64toBlob(
          e.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = ImageData;
    }

    this.form.patchValue({image: imageFile});
  }

  ionViewWillEnter() {
    this.isSelectedLocation = false;
  }

  onCreateOffer() {
    if (!this.form.valid || this.form.get('image').value) {
      return;
    }

    console.log(this.form.value);

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
