import { Action } from '@ngrx/store';
import { UserModel } from '../../../Models/user.model';

export const GET_USER = '[Auth] Get user';
export const SET_USER = '[USER] Set user';
export const AUTHENTICATED = '[Auth] Authenticated';
export const NOT_AUTHENTICATED = '[Auth] Not Authenticated';

export const GOOGLE_LOGIN = '[Auth] Google login attempt';
export const FACEBOOK_LOGIN = '[Auth] Facebook login attempt';
export const EMAILANDPASSWORD_LOGIN = '[Auth] Email And Password login attempt';

export const LOGOUT = '[Auth] Logout';
export const AUTH_ERROR = '[Auth] Error';

export class GetUser implements Action {
    readonly type = GET_USER;
    constructor(public payload?: any) {}
}
export class SetUser implements Action {
    readonly type = SET_USER;
    constructor(public payload?: any) { }
}
export class Authenticated implements Action {
    readonly type = AUTHENTICATED;
    constructor(public payload?: any) { }
}
export class NotAuthenticated implements Action {
    readonly type = NOT_AUTHENTICATED ;
    constructor(public payload?: any) { }
}
export class AuthError implements Action {
    readonly type = AUTH_ERROR ;
    constructor(public payload?: any) { }
}
export class GoogleLogin implements Action {
    readonly type = GOOGLE_LOGIN;
    constructor(public payload?: any) { }
}
export class FacebookLogin implements Action {
    readonly type = FACEBOOK_LOGIN;
    constructor(public payload?: any) { }
}
export class EmailAndPasswordLogin implements Action {
    readonly type = EMAILANDPASSWORD_LOGIN;
    constructor(public payload?: any) { }
}
export class Logout implements Action {
    readonly type = LOGOUT;
    constructor(public payload?: any) { }
}
export type UActions = GetUser | SetUser | Authenticated | NotAuthenticated | GoogleLogin
    | FacebookLogin | EmailAndPasswordLogin | AuthError | Logout;