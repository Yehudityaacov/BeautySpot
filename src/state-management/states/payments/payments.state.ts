import { IPayment } from '../../../services/payments.service';

export interface IPaymentsState {
    payments: Array<IPayment>,
    payment: IPayment
};

export const initialPaymentsState: IPaymentsState = {
    payments: new Array<IPayment>(),
    payment: null
};
