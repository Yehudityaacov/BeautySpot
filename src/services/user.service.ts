import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';
import { UserModel } from 'src/Models/user.model';
import { User } from 'firebase';
import * as firebase from 'firebase';
import { environment } from '../environments/environment.prod';
import { snapshotChanges } from '@angular/fire/database';
import { CollectionReference } from '@google-cloud/firestore';
import * as userActions from '../state-management/actions/user/user.actions';
import { IAppState } from 'src/state-management/states/app/app.state';
import { Store } from '@ngrx/store';
import { Guid } from 'src/Models/guid';
import { BusinessService } from './business.service';
@Injectable()
export class UserService {
    private user: UserModel;
    //private users:User
    public Bid: string;
    user$: Observable<UserModel>;
    constructor(private afAuth: AngularFireAuth,
        public afstore: AngularFirestore,
        private store: Store<IAppState>,
        private buisness: BusinessService) {
        //this.user$ = this.afstore.collection('users').doc(`${this.getUID()}`).valueChanges(); 
    }
    getUserById(): Observable<UserModel> {
        if (this.user) {
            var userCollection = this.afstore.collection<UserModel>('users', ref => ref.where('id', '==', this.user.uid));
            const user$ = userCollection
                .valueChanges()
                .pipe(map(user => {
                        console.log(user);
                    if (user && user.length)
                        return user[0];
                    else
                        return null;
                }));
            return user$;
        }
        return null;
    }
  
    // in case there is a delay in delivering the data to the app
    async isAuthenticated() {
        if (this.user) { return true; }
        const user = await this.afAuth.authState.pipe(first()).toPromise();
        var firebaseUser = this.afstore.doc('/users/' + user.uid);
        firebaseUser.valueChanges().subscribe((fbUser: UserModel) => {
            if (user) {
                let userToSet = {
                    username: user.email.split('@')[0],
                    uid: user.uid,
                    photoURL: user.photoURL,
                    businesses: fbUser.businesses
                };
                this.setUser(userToSet);

                this.store.dispatch(new userActions.SetUser(userToSet));
            }
            return true;
        });
        return false;
    }
    
    setUser(user: UserModel) {
        this.user = user;
    }

    getUserName(): string {
        return this.user.username;
    }

    getUID(): string {
            return this.user.uid;
    }
    //setGUID(Bid: string) {
       
    //    this.Bid = Bid;
    //}
    getGUID(): string {
    

        return this.Bid = this.user.businesses.filter(x => x.guid)[0].guid;
        
    }

    getUserDetails(): UserModel {
        return this.user;
    }

    getUserBuisenss() {
        const db = firebase.firestore();
        document.addEventListener('DOMcontentLoded', function () {
            const col = db.collection('users');
            col.where("username", "==", this.user.username).where('businesses', 'array-contains', 'la croix')
                .get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        
                        console.log(doc.id, doc.data);
                    });
                });
        });
    }
      //for    relationship user to his business-
    //public createBusiness() {
    //    //this.store.dispatch(new userActions.GetUser());
    //    this.setGUID(Guid.newGuid());
    //    const bid = this.getGUID();
    //    console.log(bid);
    //    const userid = this.getUID();
    //    //update the user arry whitenew businass he create
    //    var userdata = this.afstore.doc(`users/${userid}`);
    //    userdata.update({
    //        businesses: firebase.firestore.FieldValue.arrayUnion({
    //            guid: bid,
    //            name: this.getUserName().split(" ")[0] + " " + "business"

    //        })
    //    })
    //    //set fore the  same user its business fields
    //    this.afstore.collection('Businesses').doc(bid).set({
    //        guid: bid,
    //        name: this.getUserName()
    //    });
    //}
}
