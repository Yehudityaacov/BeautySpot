import { UserModel } from '../../../Models/user.model';

//const defaultUser = new UserModel(null, 'GEST','assets/_ionicons_svg_md-contact.svg');
export interface IUserState {
    // is a user authenticated?
    isAuthenticated: boolean;
    // if authenticated, there should be a user object
    user: UserModel;
    // error message
    errorMessage: string | null;
    
};

export const initialUserState: IUserState = {
    isAuthenticated: false,
    user: null,
    errorMessage: null
};