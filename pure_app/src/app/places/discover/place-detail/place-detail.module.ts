import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingModelComponent } from '../../../bookings/create-booking-model/create-booking-model.component';
import { SharedModule } from 'src/app/shared/shared.module';

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
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [PlaceDetailPage, CreateBookingModelComponent],
  entryComponents: [CreateBookingModelComponent],
})
export class PlaceDetailPageModule {}
