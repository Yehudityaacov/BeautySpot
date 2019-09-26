import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../../state-management/states/app/app.state';
import { IPayment } from '../../../services/payments.service';
import { selectPayment } from '../../../state-management/selectors/payments/payments.selector';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-payment-acceptance',
    templateUrl: './payment-acceptance.page.html',
    styleUrls: ['./payment-acceptance.page.scss'],
})
export class PaymentAcceptancePage implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe()
        }
    }

    public payment: IPayment;
    public gotData: boolean = false;

    private subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(private store: Store<IAppState>) { }

    ngOnInit() {
        let payment$ = this.store.pipe(select(selectPayment))
        this.subscriptions.push(payment$.subscribe(payment => {
            if (payment && payment.paymentData && payment.paymentData.id) {
                this.gotData = true;
                this.payment = payment;
            }
        }))
    }

}
