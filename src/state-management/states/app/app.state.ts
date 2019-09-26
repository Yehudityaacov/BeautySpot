import { RouterReducerState } from '@ngrx/router-store';
import { IBusinessState, initialBusinessState } from '../business/business.state';
import { IUserState, initialUserState } from '../user/user.state';
import { IAppointmentState, initialAppointmentState } from '../appointments/appointments.state';
import { IPaymentsState, initialPaymentsState } from '../payments/payments.state';

export interface IAppState{
    router?: RouterReducerState,
    business: IBusinessState,
    user: IUserState,
    appointments: IAppointmentState,
    payments: IPaymentsState
}

export const initialAppState: IAppState = {
    business: initialBusinessState,
    user: initialUserState,
    appointments: initialAppointmentState,
    payments: initialPaymentsState
}

export function getInitialState(): IAppState {
    return initialAppState;
}