import { IAppState } from "src/state-management/states/app/app.state";
import { createSelector } from '@ngrx/store';
import { IPaymentsState } from '../../states/payments/payments.state';

const selectPaymentsState = (state: IAppState) => state.payments;

export const selectPayments = createSelector(
    selectPaymentsState,
    (PaymentsState: IPaymentsState) => PaymentsState.payments
);
export const selectPayment = createSelector(
    selectPaymentsState,
    (PaymentsState: IPaymentsState) => PaymentsState.payment
);