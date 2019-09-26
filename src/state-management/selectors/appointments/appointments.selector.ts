import { IAppState } from "src/state-management/states/app/app.state";
import { createSelector } from '@ngrx/store';
import { IAppointmentState } from '../../states/appointments/appointments.state';

const selectAppointmentsState = (state: IAppState) => state.appointments;

export const selectAppointments = createSelector(
    selectAppointmentsState,
    (businessState: IAppointmentState) => businessState.appointments
);