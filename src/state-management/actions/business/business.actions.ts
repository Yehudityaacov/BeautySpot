import { Action } from '@ngrx/store';
import { expand } from 'rxjs/operators';

export enum BusinessActionTypes {
    GetBusinessById = "[Business] Get Business By Id", 
    GetBusinessByIdSuccess = "[Business] Get Business By Id Success",
    GetBusinessByIdFailure = "[Business] Get Business By Id Failure",

    GetBusinesses = "[Business] Get Businesses", 
    GetBusinessesSuccess = "[Business] Get Businesses Success",
    GetBusinessesFailure = "[Business] Get Businesses Failure",

    GetBusinessesByCategory = "[Business] Get Businesses by category",
    GetBusinessesByCategorySuccess = "[Business] Get Businesses by category Success",
    GetBusinessesByCategoryFailure = "[Business] Get Businesses by category Failure",

    EditBusiness = "[Business] Edit business",
    EditBusinessSuccess = "[Business] Edit business Success",
    EditBusinessFailure = "[Business] Edit business Failure"
}

export class GetBusinessById implements Action {
    type = BusinessActionTypes.GetBusinessById;
    constructor(public payload?: any) { }
}
export class GetBusinessByIdSuccess implements Action {
    type = BusinessActionTypes.GetBusinessByIdSuccess;
    constructor(public payload?: any) { }
}
export class GetBusinessByIdFailure implements Action {
    type = BusinessActionTypes.GetBusinessByIdFailure;
    constructor(public payload?: any) { }
}

export class GetBusinesses implements Action {
    type = BusinessActionTypes.GetBusinesses;
    constructor(public payload?: any) { }
}
export class GetBusinessesSuccess implements Action {
    type = BusinessActionTypes.GetBusinessesSuccess;
    constructor(public payload?: any) { }
}
export class GetBusinessesFailure implements Action {
    type = BusinessActionTypes.GetBusinessesFailure;
    constructor(public payload?: any) { }
}

export class GetBusinessesByCategory implements Action {
    type = BusinessActionTypes.GetBusinessesByCategory;
    constructor(public payload?: any) { }
}
export class GetBusinessesByCategorySuccess implements Action {
    type = BusinessActionTypes.GetBusinessesByCategorySuccess;
    constructor(public payload?: any) { }
}
export class GetBusinessesByCategoryFailure implements Action {
    type = BusinessActionTypes.GetBusinessesByCategoryFailure;
    constructor(public payload?: any) { }
}

export class EditBusiness implements Action {
    type = BusinessActionTypes.EditBusiness;
    constructor(public payload?: any) { }
}
export class EditBusinessSuccess implements Action {
    type = BusinessActionTypes.EditBusinessSuccess;
    constructor(public payload?: any) { }
}
export class EditBusinessFailure implements Action {
    type = BusinessActionTypes.EditBusinessFailure;
    constructor(public payload?: any) { }
}

export type BusinessActions = GetBusinesses | GetBusinessesSuccess | GetBusinessesFailure |
    GetBusinessById | GetBusinessByIdSuccess | GetBusinessByIdFailure |
    GetBusinessesByCategory | GetBusinessesByCategorySuccess | GetBusinessesByCategoryFailure |
    EditBusiness | EditBusinessSuccess | EditBusinessFailure;
