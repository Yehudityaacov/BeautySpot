import * as  userActions from '../../actions/user/user.actions';
import { UserModel } from '../../../Models/user.model';
import { initialUserState, IUserState } from 'src/state-management/states/user/user.state';


//export type Action = userActions.UAction;

//const defaultUser = new UserModel(null, 'GEST','assets/_ionicons_svg_md-contact.svg');
export function UserReducer(state = initialUserState, action: userActions.UActions): IUserState {
    switch (action.type) {
        case userActions.GET_USER:
            return { ...state, ...action.payload, loading: true };
        case userActions.SET_USER:
            return {
                ...state,
                user: action.payload
            };
        case userActions.AUTHENTICATED:
            return { ...state, ...action.payload, loading: true };
        case userActions.NOT_AUTHENTICATED:
            return { ...state, user: initialUserState.user, isAuthenticated: false };
        case userActions.GOOGLE_LOGIN:
            return { ...state, ...action.payload, loading: true };
        case userActions.FACEBOOK_LOGIN:
            return { ...state, ...action.payload, loading: true };
        case userActions.EMAILANDPASSWORD_LOGIN:
            return { ...state, ...action.payload, loading: true };
        case userActions.AUTH_ERROR:
            return { ...state, ...action.payload, loading: false };
        case userActions.LOGOUT:
            return { ...state, isAuthenticated: true };
        default:
            return state;
    }
}
