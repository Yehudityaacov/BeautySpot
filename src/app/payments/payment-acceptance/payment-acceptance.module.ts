import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentAcceptancePage } from './payment-acceptance.page';
import { PaypalComponent } from '../paypal/paypal.component';
import { MaterialModule } from '../../material-module';

const routes: Routes = [
    {
        path: '',
        component: PaymentAcceptancePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MaterialModule,
        ReactiveFormsModule
    ],
    entryComponents: [
    ],
    declarations: [
        PaymentAcceptancePage,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class PaymentAcceptancePageModule { }
