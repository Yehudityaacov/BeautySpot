import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import * as firebase from 'firebase/app';
import { IonicModule } from '@ionic/angular';

import { GoogleMapPage } from './google-map.page';

const routes: Routes = [
  {
    path: '',
    component: GoogleMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GoogleMapPage]
})
export class GoogleMapPageModule {}
