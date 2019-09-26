import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from "@angular/core";
import { IAppState } from 'src/state-management/states/app/app.state';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AppointmentsService } from 'src/services/appointment.service';
import { Observable, of } from 'rxjs';
import * as actions from '../../actions/appointments/appointments.actions';
import { nearer } from 'q';
import { flatMap, map, catchError } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';

@Injectable()
export class AppointmentsEffects {
    constructor(private store$: Store<IAppState>,
        private actions$: Actions,
        private appointmentsService: AppointmentsService) { }

    @Effect()
    getBusinessAppointmentByDate$: Observable<Action> = this.actions$.pipe(
        ofType<actions.GetBusinessAppointmentsByDate>(actions.AppointmentsActionTypes.GetBusinessAppointmentsByDate),
        flatMap((action) => {
            return this.appointmentsService.getBusinessesAppointmentByDate(action.payload.docName)
                .map(x => {
                    return new actions.GetBusinessAppointmentsByDateSuccess({
                        key: action.payload.docName,
                        value: x.appointments
                    });
                })
                .catch(err => {
                    return of(new actions.GetBusinessAppointmentsByDateFailure(err));
                });
        })
    );

    @Effect()
    addAppointment$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AddAppointment>(actions.AppointmentsActionTypes.AddAppointment),
        flatMap((action) => {
            return this.appointmentsService.addAppointment(action.payload.docName, action.payload.appointment)
                .map(x => {
                    return new actions.AddAppointmentSuccess({
                        key: action.payload.docName,
                        value: x.appointments
                    });
                })
                .catch(err => {
                    return of(new actions.AddAppointmentFailure(err));
                });
        })
    );

    @Effect()
    deleteAppointment$: Observable<Action> = this.actions$.pipe(
            ofType<actions.DeleteAppointment>(actions.AppointmentsActionTypes.DeleteAppointment),
        flatMap((action) => {
            return this.appointmentsService.deleteAppointment(action.payload.docName, action.payload.appointment)
                .map(x => {
                    return new actions.DeleteAppointmentSuccess({
                        key: action.payload.docName,
                        value: x.appointments
                    });
                })
                .catch(err => {
                    return of(new actions.DeleteAppointmentFailure(err));
                });
        })
    );

    @Effect()
    editAppointment$: Observable<Action> = this.actions$.pipe(
            ofType<actions.EditAppointment>(actions.AppointmentsActionTypes.EditAppointment),
        flatMap((action) => {
            return this.appointmentsService.editAppointment(action.payload.docName, action.payload.oldAppointment, action.payload.newAppointment)
                .map(x => {
                    return new actions.EditAppointmentSuccess({
                        key: action.payload.docName,
                        value: x.appointments
                    });
                })
                .catch(err => {
                    return of(new actions.EditAppointmentFailure(err));
                });
        })
    );
}