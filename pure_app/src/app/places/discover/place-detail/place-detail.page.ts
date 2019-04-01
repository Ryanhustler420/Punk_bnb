import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular';
import {CreateBookingModelComponent} from '../../../bookings/create-booking-model/create-booking-model.component';
import {Place} from './../../place.model';
import {PlacesService} from './../../places.service';
import {Subscription} from 'rxjs';
import {BookingService} from './../../../bookings/booking.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
        });
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
}
