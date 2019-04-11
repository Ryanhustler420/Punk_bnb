import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import {CreateBookingModelComponent} from '../../../bookings/create-booking-model/create-booking-model.component';
import {Place} from './../../place.model';
import {PlacesService} from './../../places.service';
import {Subscription} from 'rxjs';
import {BookingService} from './../../../bookings/booking.service';
import {AuthService} from './../../../auth/auth.service';
import {MapService} from './../../../map/map.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  isBookable = false;
  isLoading = false;
  address: string;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          place => {
            this.place = place;
            this.getAddressText();
            this.isBookable = place.userId !== this.authService.userId;
            this.isLoading = false;
          },
          err => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okey',
                    handler: () => {
                      this.router.navigate(['/places/tabs/discover']);
                    },
                  },
                ],
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onBookPlace() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            // role: 'destructive'
          },
        ],
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: CreateBookingModelComponent,
        componentProps: {
          selectedPlace: this.place,
          selectedMode: mode,
        },
      })
      .then(modelEl => {
        modelEl.present();
        return modelEl.onDidDismiss();
      })
      .then(resultData => {
        this.loadingCtrl
          .create({
            message: 'Booking place...',
          })
          .then(loadingEL => {
            loadingEL.present();
            const data = resultData.data.bookingData;
            if (resultData.role === 'confirm') {
              return this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEL.dismiss();
                });
            }
          });
      });
  }

  getAddressText() {
    this.mapService
      .getAddressTextFromLatLng(
        this.place.location.lat,
        this.place.location.lng
      )
      .subscribe(add => {
        this.address = add.place_name.split(',').join();
      });
  }
}
