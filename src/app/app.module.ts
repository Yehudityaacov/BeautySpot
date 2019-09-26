/*      General      */
import { environment } from '../environments/environment.prod';
import { Globals } from '../globals';

/*      Ionic        */
import { NavController, IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


/*      Angular      */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


/*      Firebase     */
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import * as firebase from 'firebase';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
/*      NGRX        */
import { StoreModule, ActionReducer, State } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { storeLogger } from 'ngrx-store-logger';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from 'src/state-management/reducers/app/app.reducer';

/*      Services      */
import { BusinessService } from '../services/business.service';
import { UserService } from '../services/user.service';
import { GeoService } from './google-map/geo.service';
import { UploadService } from '../services/upload.service';
import { AuthService } from 'src/Guards/auth.authService';
import { AppointmentsService } from '../services/appointment.service';
import { SnackbarService } from 'src/services/snackbar.service';
import { CategoryService } from '../services/category.service';
import { PaymentsService } from '../services/payments.service';
import { ImageService } from '../services/image.service';

/*     3rd Party Modules     */
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import * as moment from 'moment';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx'

/*      Effects     */
import { BusinessEffects } from 'src/state-management/effects/business/business.effects';
import { UserEffects } from 'src/state-management/effects/user/user.effects';
import { AppointmentsEffects } from '../state-management/effects/appointments/appointments.effects';
import { PaymentsEffects } from '../state-management/effects/payments/payments.effects';

/*      GoogleMaps      */
import { AgmCoreModule } from '@agm/core';

/*      Components   */
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CreateEventComponent } from './calendar/create-event/create-event.component';
import { PaypalComponent } from './payments/paypal/paypal.component';
import { InfoComponent } from './business-page/view-business/info/info.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';


/*      Pages        */
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';
import { GoogleMapPage } from './google-map/google-map.page';
import { CategoryPagePage } from './business/category-page/category-page.page';
import { UserBusinessPagePage } from './user-business-page/user-business-page.page';
import { BusinessPage } from './business/business.page';
import { BusinessPagePage } from './business-page/business-page.page';
import { PaymentAcceptancePage } from './payments/payment-acceptance/payment-acceptance.page';
import { UploadimagePage } from './uploadimage/uploadimage.page';
import { PhotogalleryPage } from './photogallery/photogallery.page';

/*      Modules      */
import { BusinessPageModule } from './business/business.module';
import { MaterialModule } from './material-module';
import { MdlModule } from "@angular-mdl/core/components";
import { AppRoutingModule } from './app-routing.module';
import { CategoryPagePageModule } from './business/category-page/category-page.module';
import { UserBusinessPagePageModule } from './user-business-page/user-business-page.module';
import { BusinessPagePageModule } from './business-page/business-page.module';
import { BusinessCalendarPageModule } from './business-calendar/business-calendar.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaymentAcceptancePageModule } from './payments/payment-acceptance/payment-acceptance.module';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { HttpModule } from '@angular/http';
import { NgxGalleryModule } from 'ngx-gallery';

export function logger(reducer: ActionReducer<IAppState>): any {
    return storeLogger()(reducer);
}

export const metaReducers = environment.production ? [logger] : [logger];

@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        LoginPage,
        SignupPage,
        GoogleMapPage,
        SignupPage,
       // CalendarComponent,
        CreateEventComponent,
        PaypalComponent,
        UploadimagePage,
        PhotogalleryPage,
        InfoComponent,
        ImageUploaderComponent
    ],
    entryComponents: [
        HomePage,
        LoginPage,
        SignupPage,
        GoogleMapPage,
        BusinessPage,
        SignupPage,
        UserBusinessPagePage,
        BusinessPagePage,
        CreateEventComponent,
        UploadimagePage,
        PhotogalleryPage,
        PaymentAcceptancePage,
        PaypalComponent,
        InfoComponent,
        ImageUploaderComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
        MdlModule,
        HttpClientModule,
        HttpModule,
        IonicModule.forRoot(),
        StoreModule.forRoot(appReducers, { metaReducers }),
        RouterModule,
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([
            BusinessEffects,
            UserEffects,
            AppointmentsEffects,
            PaymentsEffects
        ]),
        AppRoutingModule,
        NgxPayPalModule,
        NgxImageGalleryModule,
        NgxGalleryModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule,
        AgmCoreModule.forRoot({ apiKey: environment.GoogleMapKey }),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BusinessPageModule,
        PaymentAcceptancePageModule,
        CategoryPagePageModule,
        UserBusinessPagePageModule,
        BusinessPagePageModule,
        BusinessCalendarPageModule,
        AngularFireFunctionsModule
    ],
    providers: [
        File,
        Camera,
        GooglePlus,
        StatusBar,
        SplashScreen,
        ImagePicker,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        BusinessService,
        SnackbarService,
        Globals,
        UserService,
        AppointmentsService,
        AuthService,
        CategoryService,
        PaymentsService,
        ImageService,
        GeoService,
        AngularFirestore,
        Facebook,
        UploadService,
        { provide: FunctionsRegionToken, useValue: 'us-central1' },
        { provide: 'moment', useValue: moment }
      
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
