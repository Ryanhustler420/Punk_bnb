import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingModelComponent } from '../../../bookings/create-booking-model/create-booking-model.component';
import { MapBoxComponent } from './../../../map/map-box/map-box.component';

const routes: Routes = [
  {
    path: '',
    component: PlaceDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlaceDetailPage, CreateBookingModelComponent, MapBoxComponent],
  entryComponents: [CreateBookingModelComponent],
})
export class PlaceDetailPageModule {}
