import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { MyErrorStateMatcher } from '../../../common/myErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { BusinessModel } from '../../../services/business.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../../state-management/states/app/app.state';

import * as actions from '../../../state-management/actions/payments/payments.actions';
import { IPayment } from '../../../services/payments.service';
import { Subscription, Observable } from 'rxjs';
import { UserModel } from '../../../Models/user.model';
import { selectUser } from '../../../state-management/selectors/user/user.selector';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SnackbarService } from 'src/services/snackbar.service';

@Component({
    selector: 'app-paypal',
    templateUrl: './paypal.component.html',
    styleUrls: ['./paypal.component.scss'],
})
export class PaypalComponent implements OnInit, OnDestroy {

    @Input()
    public business: BusinessModel;

    public payPalConfig?: IPayPalConfig;

    public productName: string;

    public amount: number;

    public matcher = new MyErrorStateMatcher();

    public productNameController = new FormControl('', [
        Validators.required
    ]);

    public amountController = new FormControl('', [
        Validators.required,
        Validators.min(1)
    ]);

    private subscriptions: Array<Subscription> = new Array<Subscription>();

    private userId: string;

    constructor(private store: Store<IAppState>,
        private router: Router,
        private snackbarService: SnackbarService,
        public modalController: ModalController) { }

    ngOnInit() {
        this.initConfig();
        let user$: Observable<UserModel> = this.store.pipe(select(selectUser));
        this.subscriptions.push(user$.subscribe(user => {
            this.userId = user.uid;
        }))
    }

    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: 'ILS',
            clientId: 'Ab5eKH6eYJ2DFcEZCpG5eLUv7kds33lbHZWdigD0e3x7RuU2dypcuUpjwpXzRpYKO8SwG2rKJ1cBzN59',
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'ILS',
                            value: this.amount + '',
                            breakdown: {
                                item_total: {
                                    currency_code: 'ILS',
                                    value: this.amount + ''
                                }
                            }
                        },
                        items: [
                            {
                                name: this.productName,
                                quantity: '1',
                                category: 'PHYSICAL_GOODS',
                                unit_amount: {
                                    currency_code: 'ILS',
                                    value: this.amount + '',
                                },
                            }
                        ]
                    }
                ]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then(details => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                let paymentData: IPayment = {
                    userId: this.userId,
                    businessGuid: this.business.guid,
                    paymentData: data
                };
                this.store.dispatch(new actions.AddPayment(paymentData));
                this.modalController.dismiss();
                this.router.navigateByUrl('payment-acceptance');
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: err => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }

    public closeModal() {
        this.snackbarService.showErrorToast('תשלום לעסק בוטל');
        this.modalController.dismiss();
    }
}
