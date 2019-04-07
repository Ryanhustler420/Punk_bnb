import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';

import {LocationPickerComponent} from './pickers/location-picker/location-picker.component';
import {MapModalComponent} from './map-modal/map-modal.component';
import {MapBoxComponent} from '../map/map-box/map-box.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent, MapBoxComponent, ImagePickerComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [LocationPickerComponent, MapModalComponent, MapBoxComponent, ImagePickerComponent],
  entryComponents: [MapModalComponent],
})
export class SharedModule {}
