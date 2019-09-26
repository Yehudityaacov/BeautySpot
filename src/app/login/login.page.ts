import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../../services/login.service';
import { NavController } from '@ionic/angular';
import { auth, User } from 'firebase/app';
import { UserService } from '../../services/user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserModel } from '../../Models/user.model';
import { IAppState } from 'src/state-management/states/app/app.state';
import { Store, select } from '@ngrx/store';
import * as userActions from '../../state-management/actions/user/user.actions';
import { selectUser } from 'src/state-management/selectors/user/user.selector';


import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    //public username: string ;
    //public password: string;
    public username: AbstractControl;
    public password: AbstractControl;
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    mainuser: AngularFirestoreDocument;
    //userData: any;
    user$: Observable<UserModel>;
    public user: UserModel;
    // userData:User;
    User: Observable<firebase.User>;
    constructor(private afAuth: AngularFireAuth,
        private loginservice: LoginService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private store: Store<IAppState>,
        private router: Router,
        private facebook: Facebook,
        private gplus: GooglePlus,
        private platform: Platform,
        public Navctrl: NavController,
        public userSer: UserService,
        public afstore: AngularFirestore) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+$')])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6),
            Validators.maxLength(20)])],
        });
        this.username = this.loginForm.controls['username'];
        this.password = this.loginForm.controls['password'];
    }

    ngOnInit() {

      
         //this.afAuth.authState.subscribe(user => {
         //    if (user) {
         //        this.store.dispatch(new userActions.SetUser(user));
         //        this.store.dispatch(new userActions.GetUser());
         //    } else {
         //        this.store.dispatch(new userActions.SetUser(null));
               
         //    }
         //});
        //if the user is already loged in ?

      

      

    }

    //async presentAlert(title: string, content: string) {
    //    const alert = await this.alert.create({
    //        header: title,
    //        message: content,
    //        buttons: ['OK']
    //    });

    //     await alert.present();
    // }
    async loginF(): Promise<void> {
        // const userData= this.facebook.login(['email', 'public_profile']).then((res:FacebookLoginResponse)=>{

        //     if(res.status==='connected'){

        //         this.user.uid=res.authResponse.userID;
        //         this.user.photoURL= 'https://graph.facebook.com/' + res.authResponse.userID + '/picture?type=square'
        //     }
        //     this.Navctrl.navigateForward('home');
        // });

        const res2 = await this.loginservice.loginFB();
        if (res2 && res2.user && res2.user.uid) {
            this.afstore.collection('users').doc(res2.user.uid).update({
                username: res2.user.displayName,
                uid: res2.user.uid,

            });
        }
            var firebaseUser = this.afstore.doc('/users/' + res2.user.uid);
            firebaseUser.valueChanges().subscribe((fbUser: UserModel) => {
                if (res2.user) {
                    let userToSet = {
                        username: res2.user.displayName,
                        uid: res2.user.uid,
                        photoURL: res2.user.photoURL,
                        businesses: fbUser.businesses
                    };
                    this.userSer.setUser(userToSet);

                this.store.dispatch(new userActions.SetUser(userToSet));
               // this.store.dispatch(new userActions.FacebookLogin());
                this.Navctrl.navigateForward('home');
            }
        });
    }

    async loginG(): Promise<void> {

        const res = await this.loginservice.loginGoogle();

        this.afstore.collection('users').doc(res.user.uid).set({
            username: res.user.displayName,
            uid: res.user.uid,
          
        });
        var firebaseUser = this.afstore.doc('/users/' + res.user.uid);
        firebaseUser.valueChanges().subscribe((fbUser: UserModel) => {
            if (res.user) {
                let userToSet = {
                    username: res.user.displayName,
                    uid: res.user.uid,
                    photoURL: res.user.photoURL,
                    businesses: fbUser.businesses
                };
                this.userSer.setUser(userToSet);

                this.store.dispatch(new userActions.SetUser(userToSet));
                   // this.store.dispatch(new userActions.GoogleLogin());
                this.Navctrl.navigateForward('home');
            }
        });
    }

    logout() {
       // this.afAuth.auth.signOut();
        //this.store.dispatch(new userActions.Logout());
        this.Navctrl.navigateBack('home');
    }
    Register() {
        this.Navctrl.navigateForward('signup');
    }
    async  loginByNameandPassword() :Promise<void>{
        //realtime binding
        const { username, password } = this;

        try {
            //----> need to change to email to the firest username!!
           const res= await this.loginservice.loginNameandPassword(username.value, password.value);

                this.afstore.collection('users').doc(res.user.uid).set({
                    username: username.value,
                    uid: res.user.uid,
                    password: password.value

                });
                var firebaseUser = this.afstore.doc('/users/' + res.user.uid);
                firebaseUser.valueChanges().subscribe((fbUser: UserModel) => {
                    if (res.user) {
                        let userToSet = {
                            username: res.user.displayName,
                            uid: res.user.uid,
                            photoURL: res.user.photoURL,
                            businesses: fbUser.businesses,
                            password: password.value
                        };
                        this.userSer.setUser(userToSet);

                        this.store.dispatch(new userActions.SetUser(userToSet));
                        this.store.dispatch(new userActions.EmailAndPasswordLogin());

                         
                        this.Navctrl.navigateForward('home');
                    }

                });
           
          
        } catch (err) {
            console.dir(err)
            if (err.code === "auth/user-not-found") {
                console.log("user not found")
            }
        }

    }

}


