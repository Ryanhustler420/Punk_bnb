import {Component, OnInit, OnDestroy} from '@angular/core';
import {Place} from './../../place.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PlacesService} from './../../places.service';
import {NavController, LoadingController} from '@ionic/angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  place: Place;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private lodingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeSub = this.placeService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          // init form
          this.initForm();
        });
    });
  }

  ngOnDestroy() {
    this.placeSub.unsubscribe();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl(this.place.title, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(this.place.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
    });
  }

  onEditRequestSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.lodingCtrl
      .create({
        message: 'Updating place...',
      })
      .then(loadingEL => {
        loadingEL.present();
        this.placeService
          .editPlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEL.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
