import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
    constructor(public router: Router, private userservice: UserService
    ) { }

   async canActivate(route: any) {
        if ( await this.userservice.isAuthenticated()) {
            return true;
        }
        this.router.navigate(['home']);
        return false;
   }
}
