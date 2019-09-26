import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { SignupPage } from './signup/signup.page';
import { BusinessPage } from './business/business.page';
import { GoogleMapPage } from './google-map/google-map.page';
import { CategoryPagePage } from './business/category-page/category-page.page';
import { UserBusinessPagePage } from './user-business-page/user-business-page.page';
import { BusinessPagePage } from './business-page/business-page.page';
import { BusinessCalendarPage } from './business-calendar/business-calendar.page';
import { CalendarComponent } from './calendar/calendar.component';
import { UploadimagePage } from './uploadimage/uploadimage.page';
import { PhotogalleryPage } from './photogallery/photogallery.page';
import { AuthService } from 'src/Guards/auth.authService';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePage,
    },
    {
        path: 'signup',
        component: SignupPage,
        //canActivate: [AuthService]
    },
    {
        path: 'login',
        component: LoginPage,
        //canActivate: [AuthService]
    },
    {
        path: 'business',
        component: BusinessPage
    },
    {
        path: 'category',
        component: CategoryPagePage
    },
    {
        path: 'google-map',
         component: GoogleMapPage
    },
    {
        path: 'user-business-page',
        component: UserBusinessPagePage
    },
    {
        path: 'business-page',
        component: BusinessPagePage
    },
    {
        path: 'business-page/:bid/:view',
        component: BusinessPagePage
    },
    {
        path: 'business-calendar',
        component: BusinessCalendarPage
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'uploadimage',
        component: UploadimagePage
    },
    {
        path: 'photogallery',
        component: PhotogalleryPage
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
