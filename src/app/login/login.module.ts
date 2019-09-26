import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { BrowserModule } from '@angular/platform-browser';



const routes: Routes = [
    {
        path: '',
        component: LoginPage

        
    },
    //{
    //    path: '/sinup',
    //    component: SignupPage
    //}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BrowserModule,
        RouterModule.forChild(routes),


    ],
    //providers:
    //    [{ provide: AuthServiceConfig, useFactory: provideConfig }
    //],

})
export class LoginPageModule { }
