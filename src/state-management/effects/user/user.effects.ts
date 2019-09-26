import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserModel } from '../../../Models/user.model';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../../services/login.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/switchMap';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import * as  userActions from '../../actions/user/user.actions';



export type Action = userActions.UActions;
@Injectable()
export class UserEffects {
    constructor(private actions: Actions, private afAuth: AngularFireAuth, private loginservice: LoginService) { }
    // get the current user from firebase
    @Effect()
    getUser: Observable<Action> = this.actions.pipe(ofType(userActions.GET_USER))
        .map((action: userActions.GetUser) => action.payload)
        .switchMap(payload => this.afAuth.authState)
        .delay(200)
        .map(authData => {
            if (authData) {//user logged in 
                const user = new UserModel();
                return new userActions.Authenticated(user);
            } else {
                return new userActions.NotAuthenticated();
            }
        })
        .catch(err => Observable.of(new userActions.AuthError()));

    @Effect()
    loginFb: Observable<Action> = this.actions.pipe(ofType(userActions.FACEBOOK_LOGIN))
        .map((action: userActions.FacebookLogin) => action.payload)
            .switchMap(payload => {
                return Observable.fromPromise(this.loginservice.loginFB());
        })
        .map(credential => {
            return new userActions.GetUser();
        }).catch(err => {
            return Observable.of(new userActions.AuthError({ error: err.massage }));
        });
    @Effect()
    loginGo: Observable<Action> = this.actions.pipe(ofType(userActions.GOOGLE_LOGIN))
        .map((action: userActions.GoogleLogin) => action.payload)
            .switchMap(payload => {
                return Observable.fromPromise(this.loginservice.loginGoogle());
        })
        .map(credential => {
            return new userActions.GetUser();
        }).catch(err => {
            return Observable.of(new userActions.AuthError({ error: err.massage }));
        });
    @Effect()
    login: Observable<Action> = this.actions.pipe(ofType(userActions.EMAILANDPASSWORD_LOGIN))
        .map((action: userActions.EmailAndPasswordLogin) => action.payload)
            .switchMap(payload => {
                return Observable.fromPromise(this.loginservice.loginNameandPassword(payload.username, payload.password));
        })
        .map(credential => {
            return new userActions.GetUser();
        }).catch(err => {
            return Observable.of(new userActions.AuthError({ error: err.massage }));
        });
    @Effect()
    logout: Observable<Action> = this.actions.pipe(ofType(userActions.LOGOUT))
        .map((action: userActions.Logout) => action.payload)
            .switchMap(payload => {
                return Observable.fromPromise(this.afAuth.auth.signOut());
        })
            .map(authData => {
                return new userActions.NotAuthenticated();
        }).catch(err => {
            return Observable.of(new userActions.AuthError({ error: err.massage }));
        });


    //private googleLogin(): Promise<any> {
    //    const provider = new firebase.auth.GoogleAuthProvider();
    //    return this.afAuth.auth.signInWithPopup(provider);

    //}
  

}




