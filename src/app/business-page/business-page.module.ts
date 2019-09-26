import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BusinessPagePage } from './business-page.page';
import { MaterialModule } from '../material-module';
import { ViewBusinessComponent } from './view-business/view-business.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';

const routes: Routes = [
    {
        path: '',
        component: BusinessPagePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [ViewBusinessComponent, EditBusinessComponent],
    declarations: [BusinessPagePage, ViewBusinessComponent, EditBusinessComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BusinessPagePageModule { }
