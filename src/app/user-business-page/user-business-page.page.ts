import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { Observable } from 'rxjs';
import { UserModel } from '../../Models/user.model';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../state-management/states/app/app.state';
import { selectUser } from '../../state-management/selectors/user/user.selector';

@Component({
    selector: 'app-user-business-page',
    templateUrl: './user-business-page.page.html',
    styleUrls: ['./user-business-page.page.scss'],
})
export class UserBusinessPagePage implements OnInit {

    public user$: Observable<UserModel>;
    constructor(private userService: UserService,
        private router: Router,
    private store:Store<IAppState>) {
        //this.user = this.userService.getUserDetails();
        this.user$ = this.store.pipe(select(selectUser));
    }

    ngOnInit() {
        
           
        
    }

    public getBusinessById(businessId: string) {
        this.router.navigateByUrl('business-page/' + businessId + '/0');
    }
    public addBuisness() {
        this.router.navigateByUrl('business-page/0/0');
    }
}
