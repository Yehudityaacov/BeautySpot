import { Action } from '@ngrx/store';
import { expand } from 'rxjs/operators';

export enum AppointmentsActionTypes {
    GetBusinessAppointmentsByDate = "[Appointments] Get Business Appointments By Date", 
    GetBusinessAppointmentsByDateSuccess = "[Appointments] Get Business Appointments By Date Success",
    GetBusinessAppointmentsByDateFailure = "[Appointments] Get Business Appointments By Date Failure",
    
    AddAppointment = "[Appointments] Add Appointment",
    AddAppointmentSuccess = "[Appointments] Add Appointment Success",
    AddAppointmentFailure = "[Appointments] Add Appointment Failure",

    DeleteAppointment = "[Appointments] Delete Appointment",
    DeleteAppointmentSuccess = "[Appointments] Delete Appointment Success",
    DeleteAppointmentFailure = "[Appointments] Delete Appointment Failure",

    EditAppointment = "[Appointments] Edit Appointment",
    EditAppointmentSuccess = "[Appointments] Edit Appointment Success",
    EditAppointmentFailure = "[Appointments] Edit Appointment Failure"
}

export class GetBusinessAppointmentsByDate implements Action {
    type = AppointmentsActionTypes.GetBusinessAppointmentsByDate;
    constructor(public payload?: any) { }
}
export class GetBusinessAppointmentsByDateSuccess implements Action {
    type = AppointmentsActionTypes.GetBusinessAppointmentsByDateSuccess;
    constructor(public payload?: any) { }
}
export class GetBusinessAppointmentsByDateFailure implements Action {
    type = AppointmentsActionTypes.GetBusinessAppointmentsByDateFailure;
    constructor(public payload?: any) { }
}

export class AddAppointment implements Action {
    type = AppointmentsActionTypes.AddAppointment;
    constructor(public payload?: any) { }
}
export class AddAppointmentSuccess implements Action {
    type = AppointmentsActionTypes.AddAppointmentSuccess;
    constructor(public payload?: any) { }
}
export class AddAppointmentFailure implements Action {
    type = AppointmentsActionTypes.AddAppointmentFailure;
    constructor(public payload?: any) { }
}

export class DeleteAppointment implements Action {
    type = AppointmentsActionTypes.DeleteAppointment;
    constructor(public payload?: any) { }
}
export class DeleteAppointmentSuccess implements Action {
    type = AppointmentsActionTypes.DeleteAppointmentSuccess;
    constructor(public payload?: any) { }
}
export class DeleteAppointmentFailure implements Action {
    type = AppointmentsActionTypes.DeleteAppointmentFailure;
    constructor(public payload?: any) { }
}

export class EditAppointment implements Action {
    type = AppointmentsActionTypes.EditAppointment;
    constructor(public payload?: any) { }
}
export class EditAppointmentSuccess implements Action {
    type = AppointmentsActionTypes.EditAppointmentSuccess;
    constructor(public payload?: any) { }
}
export class EditAppointmentFailure implements Action {
    type = AppointmentsActionTypes.EditAppointmentFailure;
    constructor(public payload?: any) { }
}

export type AppointmentsActions = GetBusinessAppointmentsByDate | GetBusinessAppointmentsByDateSuccess | GetBusinessAppointmentsByDateFailure
    | AddAppointment | AddAppointmentSuccess | AddAppointmentFailure
    | DeleteAppointment | DeleteAppointmentSuccess | DeleteAppointmentFailure
    | EditAppointment | EditAppointmentSuccess | EditAppointmentFailure;
