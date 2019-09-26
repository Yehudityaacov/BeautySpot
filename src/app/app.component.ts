import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../services/login.service';
import { NgModel } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Guid } from '../Models/guid';
import { BusinessService } from '../services/business.service';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from 'src/Models/user.model';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { selectUser } from 'src/state-management/selectors/user/user.selector';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit,OnDestroy{
    private allAppPages = [
        {
            title: 'מסך הבית',
            url: '/home',
            loggedOnly: false
        },
        {
            title: 'התחברות',
            url: '/login',
            loggedOnly: false
        },
        {
            title: 'בתי עסק',
            url: '/business',
            loggedOnly: false
        },
        {
            title: 'עריכת עסק',
            url: '/user-business-page',
            loggedOnly: true
        }
    ];
    public appPages = [];

    private user$: Observable<UserModel>;
    private subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
        private store:Store<IAppState>
    ) {
        this.initializeApp();
        iconRegistry.addSvgIcon('lips', sanitizer.bypassSecurityTrustResourceUrl(
            'assets/icon/lips.svg'));
        this.user$ = this.store.pipe(select(selectUser));
        this.subscriptions.push(this.user$.subscribe(user => {
            if (user && user.uid) {
                this.appPages = this.allAppPages;
            } else {
                this.appPages = this.allAppPages.filter(p => !p.loggedOnly);
            }
        }));
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
    ngOnInit() {
        document.addEventListener("deviceready", function () {
            alert(device.platform);
        }, false);
        var device;
    }
    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
    
}
