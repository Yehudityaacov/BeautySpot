import { Component, OnInit, OnDestroy, Inject, ViewContainerRef } from '@angular/core';
import { BusinessModel } from 'src/services/business.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { Observable, of, Subscription } from 'rxjs';
import { selectBusiness } from '../../state-management/selectors/business/business.selector';
import { selectUser } from 'src/state-management/selectors/user/user.selector';
import { addDays, startOfWeek } from 'date-fns';

import * as actions from '../../state-management/actions/appointments/appointments.actions';

import * as moment from 'moment';
import { CalendarMode } from 'src/Models/calendarMode.enum';
import { CalendarReservationModel } from '../../Models/calendarReservationModel.model';
import { AppointmentModel } from '../../services/appointment.service';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { MdlDialogOutletService } from '@angular-mdl/core';
import { CalendarEvent } from 'calendar-utils';
import { UserModel } from 'src/Models/user.model';

@Component({
    selector: 'app-business-calendar',
    templateUrl: './business-calendar.page.html',
    styleUrls: ['./business-calendar.page.scss'],
})
export class BusinessCalendarPage implements OnInit, OnDestroy {
    public business: BusinessModel;
    public editMode: CalendarMode = CalendarMode.View;

    private daysToExclude: Array<number> = [1, 2, 3, 4, 5, 6, 7];
    private minHour: number = 25;
    private maxHour: number = 0;
    private subscriptions: Array<Subscription> = new Array<Subscription>();
    private user: UserModel;


    constructor(private store: Store<IAppState>,
        @Inject('moment') public moment,
        vcRef: ViewContainerRef,
        mdlDialogService: MdlDialogOutletService) {
        mdlDialogService.setDefaultViewContainerRef(vcRef);
        let business$ = this.store.pipe(select(selectBusiness));
        this.subscriptions.push(business$.subscribe(business => {
            if (business && business.guid) {
                this.business = business; let user$ = this.store.pipe(select(selectUser));
                this.subscriptions.push(user$.subscribe(user => {
                    if (user && user.uid) {
                        let userBusinesses = user.businesses.map(u => u.guid);
                        let filtered = userBusinesses.filter(b => b === business.guid);
                        if (filtered && filtered.length && filtered.length > 0) {
                            this.editMode = CalendarMode.Edit;
                        }
                    }

                }))
                let weekStart = startOfWeek(new Date());
                this.loadDays(weekStart);
            }
        }));
        let user$ = this.store.pipe(select(selectUser));
        this.subscriptions.push(user$.subscribe(u => {
            if (u && u.uid.length && u.uid.length > 0) {
                this.user = u;
            }
        }));

    }

    private loadDays(weekStart: Date) {
        this.daysToExclude = [1, 2, 3, 4, 5, 6, 7];
        let validDays: Array<string> = new Array<string>();
        for (var i = 0; i < this.business.openingHours.length; i++) {
            this.daysToExclude = this.daysToExclude.filter(d => d !== this.business.openingHours[i].day);
            let fromHour: number = this.getTimeFromString(this.business.openingHours[i].fromHour);
            let toHour: number = this.getTimeFromString(this.business.openingHours[i].toHour);
            if (!isNaN(fromHour) && fromHour <= this.minHour) {
                this.minHour = fromHour;
            }
            if (!isNaN(toHour) && toHour >= this.maxHour) {
                this.maxHour = toHour;
            }
            validDays.push(this.business.guid + "_" + moment(addDays(weekStart, (this.business.openingHours[i].day - 1))).format('DD_MM_YYYY'));
        }
        this.daysToExclude = this.daysToExclude.map(d => d - 1);
        for (var i = 0; i < validDays.length; i++) {
            this.store.dispatch(new actions.GetBusinessAppointmentsByDate({ docName: validDays[i] }));
        }
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    private getTimeFromString(time: string): number {
        if (time.indexOf(":") !== -1) {
            var spl = time.split(":");
            if (spl.length === 2) {
                let hour: number = +(spl[0]);
                return hour;
            }
        }
        return NaN;
    }

    public onDateChanged($event) {
        this.loadDays($event.start);
    }

    public onEventCreated($event: CalendarReservationModel) {
        let docName = this.business.guid + "_" + moment($event.fromDate).format('DD_MM_YYYY');
        let appointment: AppointmentModel = new AppointmentModel();

        appointment.fromHour = new Timestamp($event.fromDate.getTime() / 1000, 0);
        appointment.toHour = new Timestamp($event.toDate.getTime() / 1000, 0);
        appointment.name = $event.name;
        appointment.userId = this.user.uid;

        this.store.dispatch(new actions.AddAppointment({
            docName: docName,
            appointment: appointment,
        }));
    }

    public onEventDeleted($event: CalendarEvent) {
        let docName = this.business.guid + "_" + moment($event.start).format('DD_MM_YYYY');
        let appointment: AppointmentModel = new AppointmentModel();

        appointment.fromHour = new Timestamp($event.start.getTime() / 1000, 0);
        appointment.toHour = new Timestamp($event.end.getTime() / 1000, 0);
        appointment.name = $event.title;

        this.store.dispatch(new actions.DeleteAppointment({
            docName: docName,
            appointment: appointment
        }));
    }

    public onEventEdited($event) {
        let oldA: CalendarReservationModel = $event.oldAppointment;
        let newA: CalendarReservationModel = $event.newAppointment;

        let docName = this.business.guid + "_" + moment(oldA.fromDate).format('DD_MM_YYYY');

        let oldAppointment: AppointmentModel = new AppointmentModel();
        let newAppointment: AppointmentModel = new AppointmentModel();

        oldAppointment.fromHour = new Timestamp(oldA.fromDate.getTime() / 1000, 0);
        oldAppointment.toHour = new Timestamp(oldA.toDate.getTime() / 1000, 0);
        oldAppointment.name = oldA.name;

        newAppointment.fromHour = new Timestamp(newA.fromDate.getTime() / 1000, 0);
        newAppointment.toHour = new Timestamp(newA.toDate.getTime() / 1000, 0);
        newAppointment.name = newA.name;

        this.store.dispatch(new actions.EditAppointment({
            docName: docName,
            oldAppointment: oldAppointment,
            newAppointment: newAppointment
        }));
    }
}
