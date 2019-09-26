
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Globals } from '../globals';
import { environment } from '../environments/environment';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, catchError } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { error } from 'util';
import { SnackbarService } from './snackbar.service';
import { ToastController } from '@ionic/angular';
import { IClientAuthorizeCallbackData } from 'ngx-paypal';


@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    constructor(private http: HttpClient,
        private globals: Globals,
        private firestore: AngularFirestore,
        private snackbarService: SnackbarService,
        private toastController: ToastController) {
    }

    getBusinessRecievedPayments(businessGuid: string): Observable<Array<IPayment>> {
        var paymentsCollection = this.firestore.collection<IPayment>('Payments', ref => ref.where('businessGuid', '==', businessGuid));
        const payments$ = paymentsCollection
            .valueChanges();
        return payments$;
    }

    addPayment(businessGuid: string, userId: string, paymentData: IClientAuthorizeCallbackData): Observable<Array<IPayment>> {
        let docName = businessGuid + userId + paymentData.create_time;
        let doc = {
            businessGuid: businessGuid,
            userId: userId,
            paymentData: paymentData
        };

        this.firestore.collection('Payments').doc(docName).set(doc);

        return this.getBusinessRecievedPayments(businessGuid);
    }
}

export interface IPayment {
    businessGuid: string;
    userId: string;
    paymentData: IClientAuthorizeCallbackData;
}