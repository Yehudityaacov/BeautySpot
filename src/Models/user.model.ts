import { BusinessModel } from 'src/services/business.service';

export interface IUser {
    username: string;
    uid: string;
    password?: string;
    photoURL: string;
    loading?: boolean;
    error?: boolean;
    businesses: BusinessModel[];
}

//export interface Roles {
//    businessOwner?: Boolean;
//    user?: Boolean;
//}


export class UserModel implements IUser {
    username: string;
    uid: string;
    password?: string;
    photoURL: string;
    loading?: boolean;
    error?: boolean;
    businesses:BusinessModel[];
   
    
}
