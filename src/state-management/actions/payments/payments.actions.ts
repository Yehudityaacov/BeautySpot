import { Action } from '@ngrx/store';
import { expand } from 'rxjs/operators';

export enum PaymentsActionTypes {
    GetPayments = "[Payments] Get Payments", 
    GetPaymentsSuccess = "[Payments] Get Payments Success",
    GetPaymentsFailure = "[Payments] Get Payments Failure",
    
    AddPayment = "[Payments] Add Payment",
    AddPaymentSuccess = "[Payments] Add Payment Success",
    AddPaymentFailure = "[Payments] Add Payment Failure"
}

export class GetPayments implements Action {
    type = PaymentsActionTypes.GetPayments;
    constructor(public payload?: any) { }
}
export class GetPaymentsSuccess implements Action {
    type = PaymentsActionTypes.GetPaymentsSuccess;
    constructor(public payload?: any) { }
}
export class GetPaymentsFailure implements Action {
    type = PaymentsActionTypes.GetPaymentsFailure;
    constructor(public payload?: any) { }
}

export class AddPayment implements Action {
    type = PaymentsActionTypes.AddPayment;
    constructor(public payload?: any) { }
}
export class AddPaymentSuccess implements Action {
    type = PaymentsActionTypes.AddPaymentSuccess;
    constructor(public payload?: any) { }
}
export class AddPaymentFailure implements Action {
    type = PaymentsActionTypes.AddPaymentFailure;
    constructor(public payload?: any) { }
}

export type PaymentsActions = GetPayments | GetPaymentsSuccess | GetPaymentsFailure
    | AddPayment | AddPaymentSuccess | AddPaymentFailure;
