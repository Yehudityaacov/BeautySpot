
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Globals } from '../globals';
import { environment } from '../environments/environment';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, catchError } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { error } from 'util';
import { SnackbarService } from './snackbar.service';
import { ToastController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class AppointmentsService {

    constructor(private http: HttpClient,
        private globals: Globals,
        private firestore: AngularFirestore,
        private snackbarService: SnackbarService,
        private toastController: ToastController) {
    }

    private appointmentsToJson(appointments: AppointmentsModel): Object {
        let json = {
            appointments: appointments.appointments.map(function (a) {
                return {
                    fromHour: a.fromHour,
                    toHour: a.toHour,
                    name: a.name,
                    userId: a.userId
                };
            })
        };
        return json;
    }

    getBusinessesAppointmentByDate(docName: string): Observable<AppointmentsModel> {
        let appointmentsCollection = this.firestore.collection<AppointmentsDictionaryModel>('Appointments').doc<AppointmentsModel>(docName);
        const appointments$ = appointmentsCollection
            .valueChanges();
        appointmentsCollection.get()
            .subscribe()

        return appointments$;
    }

    private checkIfDocumentExists(docName: string): Observable<boolean | null> {
        let exists$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
        let appointmentsCollection = this.firestore.collection<AppointmentsDictionaryModel>('Appointments').doc<AppointmentsModel>(docName);
        let sub = appointmentsCollection.get()
            .subscribe(docSnapshot => {
                exists$.next(docSnapshot.exists);
                sub.unsubscribe();
            });
        return exists$.asObservable();
    }

    private checkForConflictedApointments(appointments: AppointmentsModel, appointment: AppointmentModel): boolean {
        //filter all appointments which ends before this appointment start.
        let confilctingAppointments = appointments.appointments.filter(a => a.toHour.seconds > appointment.fromHour.seconds);

        //filter all appointments which start before this appointment start.
        confilctingAppointments = confilctingAppointments.filter(a => a.fromHour.seconds < appointment.toHour.seconds);

        confilctingAppointments = confilctingAppointments
            .filter(a => a.name !== appointment.name &&
                a.fromHour.seconds !== appointment.fromHour.seconds &&
                a.toHour.seconds !== appointment.toHour.seconds);

        return confilctingAppointments.length > 0;
    }

    addAppointment(docName: string, appointment: AppointmentModel): Observable<AppointmentsModel> {
        let temp: AppointmentsModel = new AppointmentsModel();
        temp.appointments = new Array<AppointmentModel>();
        let appointments$: BehaviorSubject<AppointmentsModel> = new BehaviorSubject<AppointmentsModel>(temp);
        let exists$ = this.checkIfDocumentExists(docName);
        let exists: boolean | null = null;
        let existsSubscription = exists$.subscribe(e => {
            exists = e;
            const dbAppointments$ = this.getBusinessesAppointmentByDate(docName);

            let subscription = dbAppointments$.subscribe(appointments => {
                if (exists === false) {
                    let model: AppointmentsModel = new AppointmentsModel();
                    model.appointments = [
                        appointment
                    ]
                    appointments$.next(model);
                    let json = this.appointmentsToJson(model);
                    this.firestore.collection('Appointments').doc(docName).set(json);
                    subscription.unsubscribe();
                    existsSubscription.unsubscribe();
                }
                else if (exists === true) {
                    if (appointments.appointments) {
                        let confilctingAppointments: boolean = this.checkForConflictedApointments(appointments, appointment);
                        if (confilctingAppointments) {
                            this.snackbarService.showErrorToast('מסגרת זמן זו תפוסה');
                            return;
                        }
                        appointments.appointments.push(appointment);
                        let json = this.appointmentsToJson(appointments);

                        this.firestore.collection('Appointments').doc(docName).update(json);
                        appointments$.next(appointments);
                        subscription.unsubscribe();
                        existsSubscription.unsubscribe();
                    }

                }
            });
        })
        return appointments$.asObservable();
    }

    deleteAppointment(docName: string, appointment: AppointmentModel): Observable<AppointmentsModel> {
        const appointments$ = this.getBusinessesAppointmentByDate(docName);
        let subscription = appointments$.subscribe(appointments => {
            if (appointments.appointments) {
                let filtered = appointments.appointments
                    .filter(a => a.name !== appointment.name &&
                        a.fromHour.seconds !== appointment.fromHour.seconds &&
                        a.toHour.seconds !== appointment.toHour.seconds);

                let temp = new AppointmentsModel();
                temp.appointments = filtered;
                let json = this.appointmentsToJson(temp);

                this.firestore.collection('Appointments').doc(docName).update(json);
                subscription.unsubscribe();
            }
        });

        return appointments$;
    }

    editAppointment(docName: string, oldAppointment: AppointmentModel, newAppointment: AppointmentModel): Observable<AppointmentsModel> {
        const appointments$ = this.getBusinessesAppointmentByDate(docName);
        let subscription = appointments$.subscribe(appointments => {
            let appointmentToUpdate: AppointmentModel;
            if (appointments.appointments) {
                for (var i = 0; i < appointments.appointments.length; i++) {
                    let temp = appointments.appointments[i];
                    if (temp.name === oldAppointment.name &&
                        temp.fromHour.seconds === oldAppointment.fromHour.seconds &&
                        temp.toHour.seconds === oldAppointment.toHour.seconds) {
                        appointmentToUpdate = temp;
                        break;
                    }
                }

                let confilctingAppointments: boolean = this.checkForConflictedApointments(appointments, newAppointment);
                if (confilctingAppointments) {
                    this.snackbarService.showErrorToast('מסגרת זמן זו תפוסה');
                    return;
                }
                appointmentToUpdate.name = newAppointment.name;
                appointmentToUpdate.fromHour = newAppointment.fromHour;
                appointmentToUpdate.toHour = newAppointment.toHour;
                let json = this.appointmentsToJson(appointments);

                this.firestore.collection('Appointments').doc(docName).update(json);
                subscription.unsubscribe();
            }
        });

        return appointments$;
    }
}

export class AppointmentModel implements IAppointmentModel {
    fromHour: Timestamp;
    toHour: Timestamp;
    name: string;
    userId: string;

    constructor(data?: IAppointmentModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}
export interface IAppointmentModel {
    fromHour: Timestamp;
    toHour: Timestamp;
    name: string;
    userId: string;
}

export class AppointmentsModel implements IAppointmentsModel {
    appointments: Array<AppointmentModel>;

    constructor(data?: IAppointmentsModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }
}
export interface IAppointmentsModel {
    appointments: Array<AppointmentModel>;
}

export class AppointmentsDictionaryModel {
    private appointments: any;
    private haveData: boolean;

    constructor(data?: AppointmentsDictionaryModel) {
        if (data && data.haveData) {
            this.appointments = {};
            for (var prop in data.appointments) {
                this.appointments[prop] = data.appointments[prop];
            }
            this.haveData = data.haveData;
        } else {
            this.appointments = {}
            this.haveData = false;
        }
    }

    public isEmpty(): boolean {
        return !this.haveData;
    }

    public getAllAppointments(): Array<AppointmentModel> {
        let ret: Array<AppointmentModel> = new Array<AppointmentModel>();
        for (var prop in this.appointments) {
            for (var i = 0; i < this.appointments[prop].length; i++) {
                ret.push(this.appointments[prop][i]);
            }
        }
        return ret;
    }

    public getAppointments(key: string): Array<AppointmentModel> {
        return this.appointments[key];
    }

    public setAppointments(key: string, appointments: Array<AppointmentModel>) {
        this.appointments[key] = appointments;
        this.haveData = true;
    }

    public addAppointment(key: string, appointment: AppointmentModel) {
        let appointments = this.appointments[key];
        if (appointments && appointments.length) {
            this.appointments[key].push(appointment);
        } else {
            this.appointments[key] = [appointment];
        }
        this.haveData = true;
    }

    public addAppointments(key: string, appointments: Array<AppointmentModel>) {
        let _appointments = this.appointments[key];
        if (_appointments && _appointments.length) {
            for (var i = 0; i < appointments.length; i++) {
                var exists = this.appointments[key].filter(a => a.name === appointments[i].name && a.fromHour.seconds === appointments[i].fromHour.seconds && a.toHour.seconds === appointments[i].toHour.seconds);
                if (exists.length > 0) {
                    continue;
                }
                this.appointments[key].push(appointments);
            }
        } else {
            this.appointments[key] = appointments;
        }
        this.haveData = true;
    }
}