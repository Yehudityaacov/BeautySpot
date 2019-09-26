import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Globals } from '../globals';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, catchError } from 'rxjs/operators';
import { Guid } from '../Models/guid';
import { UserModel } from '../Models/user.model';


@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    private baseUrl: string;

    constructor(private http: HttpClient,
        private globals: Globals,
        private firestore: AngularFirestore) {
    }

    getBusinessess(): Observable<BusinessModel[]> {
        var businessesCollection = this.firestore.collection<BusinessModel>('Businesses');
        const businesses$ = businessesCollection
            .valueChanges();

        return businesses$;
    }

    getBusByCat(category: string): Observable<BusinessModel[]> {

        var businessesCollection = this.firestore.collection<BusinessModel>('Businesses', ref => ref.where('category', '==', category));
        const businesses$ = businessesCollection
            .valueChanges();

        return businesses$;
    }

    getBusByGuid(guid: string): Observable<BusinessModel> {
        var businessesCollection = this.firestore.collection<BusinessModel>('Businesses', ref => ref.where('guid', '==', guid));
        const business$ = businessesCollection
            .valueChanges()
            .pipe(map(businesses => {
                if (businesses && businesses.length)
                    return businesses[0];
                else
                    return null;
            }));
        return business$;
    }

    editBusiness(business: BusinessModel, isNew: boolean, user: UserModel): Observable<BusinessModel> {
        let json = BusinessModel.toJson(business);
        this.firestore.collection('Businesses').doc(business.guid).set(json);
        if (isNew) {
            user.businesses.push(business);
            let userId = user.uid;
            var userdata = this.firestore.doc(`users/${userId}`);
            userdata.update({
                businesses: user.businesses.map(b => {
                    return {
                        guid: b.guid,
                        name: b.name
                    };
                })
            })
        }
        return of(business);
    }
}

export class BusinessModel implements IBusinessModel {
    guid: string;
    name: string;
    category: string;
    facebook: string;
    instagram: string;
    logo: string;
    phone: string;
    address: string;
    info: string;
    appointmentLength: number;
    pricing: Array<IPricing>;
    openingHours: Array<IOpeningHours>;
    photoGallery: string[];

    constructor(data?: IBusinessModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    public static toJson(business: BusinessModel): any {
        var ret = {
            guid: business.guid,
            name: business.name,
            category: business.category
        };

        if (business.facebook) {
            ret['facebook'] = business.facebook;
        }
        if (business.instagram) {
            ret['instagram'] = business.instagram;
        }
        if (business.logo) {
            ret['logo'] = business.logo;
        }
        if (business.phone) {
            ret['phone'] = business.phone;
        }
        if (business.address) {
            ret['address'] = business.address;
        }
        if (business.info) {
            ret['info'] = business.info;
        }
        if (business.appointmentLength) {
            ret['appointmentLength'] = business.appointmentLength;
        }
        if (business.openingHours && business.openingHours.length) {
            ret['openingHours'] = business.openingHours.map(o => OpeningHours.toJson(o));
        }
        if (business.pricing && business.pricing.length) {
            ret['pricing'] = business.pricing.map(p => Pricing.toJson(p));
        }
        if (business.photoGallery && business.photoGallery.length) {
            ret['photoGallery'] = business.photoGallery;
        }

        return ret;
    }
}


export interface IBusinessModel {
    guid: string;
    name: string;
    category: string;
    facebook: string;
    instagram: string;
    logo: string;
    phone: string;
    address: string;
    info: string;
    appointmentLength: number;
    pricing: Array<IPricing>;
    openingHours: Array<IOpeningHours>;
    photoGallery: string[];
}

export interface IPricing {
    name: string;
    price: number;
}
export class Pricing implements IPricing {
    name: string;
    price: number;

    constructor(data?: IPricing) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    public static toJson(pricing: IPricing): any {
        let ret: any = {
            name: pricing.name,
            price: pricing.price
        };
        return ret;
    }
}
export interface IOpeningHours {
    fromHour: string;
    toHour: string;
    day: number;
}
export class OpeningHours implements IOpeningHours {
    fromHour: string;
    toHour: string;
    day: number;

    constructor(data?: IOpeningHours) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    public static toJson(openingHours: IOpeningHours): any {
        let ret: any = {
            day: openingHours.day,
            fromHour: openingHours.fromHour,
            toHour: openingHours.toHour
        };

        return ret;
    }
}