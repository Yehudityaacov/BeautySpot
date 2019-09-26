import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { routerReducer } from '@ngrx/router-store';
import { businessReducer } from '../business/business.reducer';
import { UserReducer } from '../user/user.reducer';
import { appointmentsReducer } from '../appointments/appointments.reducer';
import { paymentsReducer } from '../payments/payments.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
    router: routerReducer, 
    business: businessReducer,
    user: UserReducer,
    appointments: appointmentsReducer,
    payments: paymentsReducer
}