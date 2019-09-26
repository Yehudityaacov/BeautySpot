import { BusinessService, BusinessModel } from 'src/services/business.service';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as bactions from '../../state-management/actions/business/business.actions';
import { IAppState } from 'src/state-management/states/app/app.state';
import { Store, Action, select } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Headers } from '@angular/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { UserModel } from 'src/Models/user.model';
import * as userActions from '../../state-management/actions/user/user.actions';
import { selectUser } from 'src/state-management/selectors/user/user.selector';
import { CategoryService, ICategoryModel } from '../../services/category.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public user: UserModel;
    public user$: Observable<UserModel>;

    public categories: Array<ICategoryModel>;

    constructor(public navCtrl: NavController,
        private fire: AngularFireAuth,
        private afstore: AngularFirestore,
        private rote: ActivatedRoute,
        public userService: UserService,
        private alertCtrl: AlertController,
        private router: Router,
        public log: LoginService,
        private aff: AngularFireFunctions,
        private store: Store<IAppState>,
        private categoryService: CategoryService) {
        this.user$ = this.store.pipe(select(selectUser));
        this.categories = this.categoryService.getCategories();
    }

    public getBusinessByCategory(category: string) {
        this.store.dispatch(new bactions.GetBusinessesByCategory(category));
        this.router.navigateByUrl("category");
    }
    public logout() {
       // this.fire.auth.signOut();
        this.store.dispatch(new userActions.Logout());
       // this.navCtrl.navigateBack('home');
    }
  
    
    //ngOnDestroy(): void {

    //}
    ngOnInit() {
       // this.navCtrl.navigateForward('uploadimage');
        // this.navCtrl.navigateForward('photogallery');
       // this.userService.getGUID();
        this.store.dispatch(new userActions.GetUser());
        const users = this.aff.httpsCallable('getUSERS');/// useing firebase functions to get (=retreving) all users and  all there field data thate store in  firebase 
        users({}).subscribe(
            data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] == this.user)
                        console.log(data[i]);
                }

                //console.log(data);
            });
       

    }

}
