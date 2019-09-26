import { IPaymentsState,initialPaymentsState } from 'src/state-management/states/payments/payments.state';
import * as actions from "../../actions/payments/payments.actions";

export function paymentsReducer(
    state = initialPaymentsState,
    action: actions.PaymentsActions): IPaymentsState {
    switch (action.type) {
        case actions.PaymentsActionTypes.GetPayments:
            return {
                ...state,
                payments: initialPaymentsState.payments
            };

        case actions.PaymentsActionTypes.GetPaymentsSuccess:
            return {
                ...state,
                payments: action.payload
            }

        case actions.PaymentsActionTypes.AddPayment:
            return {
                ...state,
                payment: action.payload
            }

        case actions.PaymentsActionTypes.AddPaymentSuccess:
            return {
                ...state,
                payments: action.payload
            }

        default:
            return state;
    }
}