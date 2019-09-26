import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BusinessPage } from './business.page';
import { BusinessFilterComponent } from './business-filter/business-filter.component';
import { BusinessComponent } from './business/business.component';
import { MaterialModule } from '../material-module';

const routes: Routes = [
    {
        path: '',
        component: BusinessPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [
        BusinessPage,
        BusinessFilterComponent,
        BusinessComponent
    ],
    exports: [
        BusinessFilterComponent,
        BusinessComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class BusinessPageModule { }
