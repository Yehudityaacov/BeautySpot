import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MdlSnackbarService } from "@angular-mdl/core/components";
import { ToastController } from '@ionic/angular';

@Injectable()
export class SnackbarService {

    constructor(private mdlSnackbarService: MdlSnackbarService,
        private toastController: ToastController) {
    }

    async showToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            animated: true,
            color: 'primary',
            keyboardClose: true,
            showCloseButton: true,
        });
        toast.present();
    }

    async showErrorToast(msg: string) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            animated: true,
            color: 'danger',
            keyboardClose: true,
            showCloseButton: true,
        });
        toast.present();
    }

    showSnackbar(msg: string): Observable<string | {}> {
        this.mdlSnackbarService.showSnackbar({
            message: msg,
            //action: {
            //  handler: () => {
            //    //this.mdlSnackbarService.showToast('You hit the ok Button');
            //  },
            //  text: 'OK'
            //}
        });
        return of(msg);
    }

    showAcceptSnackbar(msg: string): Observable<string | {}> {
        this.mdlSnackbarService.showSnackbar({
            message: msg,
            action: {
                handler: () => {
                    //this.mdlSnackbarService.showToast('You hit the ok Button');
                },
                text: 'OK'
            }
        });
        return of(msg);
    }

    showAcceptCallbackSnackbar(msg: string, func: () => void, buttonText?: string) {
        if (!buttonText) {
            buttonText = 'OK';
        }
        this.mdlSnackbarService.showSnackbar({
            message: msg,
            action: {
                handler: () => {
                    func();
                },
                text: buttonText
            }
        });
    }

}
