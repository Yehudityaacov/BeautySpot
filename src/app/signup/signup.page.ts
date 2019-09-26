import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../../services/login.service';
import { NavController } from '@ionic/angular';
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService} from '../../services/user.service';
import { NgForm, AbstractControl, Validators, FormGroup, FormBuilder } from '@angular/forms'
import { UserModel } from '../../Models/user.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import * as bactions from '../../state-management/actions/user/user.actions';
import { selectUser } from 'src/state-management/selectors/user/user.selector';



/// register page

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {



    public username: AbstractControl;
    public password: AbstractControl ;
    public cpassword: string ;
    signupForm: FormGroup;
    public user$: Observable<UserModel>;
    public user: UserModel = new UserModel();
// tslint:disable-next-line: no-inferrable-types
    password_type: string = 'password';

    constructor(private service: LoginService, public afAuth: AngularFireAuth, private fb: FormBuilder, public userservice: UserService,

        public Navctrl: NavController, public afstore: AngularFirestore, public alert: AlertController) {

       
       
    }

    ngOnInit() {
     
        this.signupForm = this.fb.group({
            username: ['', Validators.compose( [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+$')])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6),
                Validators.maxLength(20)])],
           
        });
        this.username = this.signupForm.controls['username'];
        this.password = this.signupForm.controls['password'];
    }

    logout1() {
        this.service.logout();
        this.Navctrl.navigateBack('login');

    }
    togglePasswordMode() {
        this.password_type = this.password_type === 'text' ? 'password' : 'text';
    }
    // an alert boxs to show if the user register 
    async presentAlert(title: string, content: string) {
        const alert = await this.alert.create({
            header: title,
            message: content,
            buttons: ['OK']
        });

        await alert.present();
    }
    async  Register( ) {
       
        const { username, password, cpassword } = this;
        if (password.value !== cpassword) {
            this.presentAlert("Error!", "Password don't match")
            return console.error("password don't match");
        }

        try {
            /// firebase allow register white email+ password --->>>small hacking
            await this.afAuth.auth.createUserWithEmailAndPassword(username.value + "@gmail.com", password.value).then(
                (success) => {
                   console.log(success.user);
                    success.user.updateProfile({
                        displayName: username.value,
                        photoURL: "assets/_ionicons_svg_md-contact.svg",

                    });
                });
            this.Navctrl.navigateForward('home');

            this.presentAlert('Success', 'You are registered!');
            this.Navctrl.navigateForward('login');
        } catch (error) {
            console.dir(error);
            //if (error.code === "auth/weak-password") {
            //    this.presentAlert("invalid!", "Password should be at least 6 characters")
            //    return console.error("Password should be at least 6 characters")
            //}
            //if (error.code === "auth/email-already-in-use") {
            //    this.presentAlert("ops", "user  already exists")
            //    return console.error("user exists!")
            //}
            //if (error.code === "auth/argument-error" || error.code === "auth/invalid-email" || username === null) {
            //    this.presentAlert("ops", "Username Or password are missing")
            //    return console.error(" missing password argumant!")
            //}
            //if (error.code === "auth/user-not-found") {
            //    this.presentAlert("ops", "user  already exists")
            //    return console.error("user exists!")
            //}
        }

    }


}
