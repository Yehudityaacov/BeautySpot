import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BusinessCalendarPage } from './business-calendar.page';
import { MaterialModule } from '../material-module';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const routes: Routes = [
    {
        path: '',
        component: BusinessCalendarPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MaterialModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })
    ],
    declarations: [
        BusinessCalendarPage,
        CalendarComponent
    ],
    exports: [CalendarComponent], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusinessCalendarPageModule { }
