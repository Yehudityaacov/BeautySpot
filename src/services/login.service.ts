import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AbstractControl } from '@angular/forms';
@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private afAuth: AngularFireAuth,
        private facebook: Facebook,
        private gplus: GooglePlus,
        private platform: Platform) { }

    // provide user property without holding back...
    async loginFB() {
        try {
            if (this.platform.is('cordova')) {
                const fbUser = await this.facebook.login(['email', 'public_profile']);
                return await this.afAuth.auth.signInWithCredential(firebase.auth.FacebookAuthProvider
                    .credential(fbUser.authResponse.accessToken));
            } else {
                const provider = new firebase.auth.FacebookAuthProvider();
                return await this.afAuth.auth.signInWithPopup(provider);
            }
        } catch (err) {
            console.log(err)
        }
    }

    async  loginGoogle() {
        try {
            if (this.platform.is('cordova')) {
                const gplusUser = await this.gplus.login({
                    'webClientId': '895196702684-vpkb1ro3n2u3aunnfhmcq8addodjo50a.apps.googleusercontent.com',
                    'offline': true,
                    'scopes': 'profile email'
                });

                return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken));
            } else {
                const provider = new firebase.auth.GoogleAuthProvider();
                return await this.afAuth.auth.signInWithPopup(provider);
            }
        } catch (err) {
            console.log(err)
        }
        // return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    logout() {
        this.afAuth.auth.signOut();
    }
    getLoggedInUser() {
        return this.afAuth.authState;
    }
    // checks whether a user is signed in or not
    // returns: Boolean
    userIsSignedIn(): boolean {
        return this.afAuth.auth.currentUser !== null;
    }
    async  loginNameandPassword(username: string, password: string) {
        return await this.afAuth.auth.signInWithEmailAndPassword(username + "@gmail.com", password);
    }

}