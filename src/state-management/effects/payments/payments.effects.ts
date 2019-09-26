import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from "@angular/core";
import { IAppState } from 'src/state-management/states/app/app.state';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PaymentsService } from 'src/services/payments.service';
import { Observable, of } from 'rxjs';
import * as actions from '../../actions/payments/payments.actions';
import { nearer } from 'q';
import { flatMap, map, catchError } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';

@Injectable()
export class PaymentsEffects {
    constructor(private store$: Store<IAppState>,
        private actions$: Actions,
        private paymentsService: PaymentsService,
        private snackbarService: SnackbarService) { }

    @Effect()
    getPayments$: Observable<Action> = this.actions$.pipe(
            ofType<actions.GetPayments>(actions.PaymentsActionTypes.GetPayments),
        flatMap((action) => {
            return this.paymentsService.getBusinessRecievedPayments(action.payload)
                .map(x => {
                    return new actions.GetPaymentsSuccess(x);
                })
                .catch(err => {
                    return of(new actions.GetPaymentsFailure(err));
                });
        })
    );

    @Effect()
    addPayment$: Observable<Action> = this.actions$.pipe(
            ofType<actions.AddPayment>(actions.PaymentsActionTypes.AddPayment),
        flatMap((action) => {
            return this.paymentsService.addPayment(action.payload.businessGuid,action.payload.userId,action.payload.paymentData)
                .map(x => {
                    return new actions.AddPaymentSuccess(x);
                })
                .catch(err => {
                    return of(new actions.AddPaymentFailure(err));
                });
        })
    );
}