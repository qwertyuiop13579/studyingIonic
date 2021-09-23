import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  entryComponents: [MapModalComponent],
  exports: [LocationPickerComponent, MapModalComponent],
  imports: [CommonModule, IonicModule],
})
export class SharedModule { }
