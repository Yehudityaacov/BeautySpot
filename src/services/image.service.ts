import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Globals } from '../globals';
import { environment } from '../environments/environment';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, catchError } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { error } from 'util';
import { SnackbarService } from './snackbar.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Guid } from '../Models/guid';

import * as firebase from "firebase";
import { BusinessModel, BusinessService } from './business.service';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(private http: HttpClient,
        private globals: Globals,
        private afStorage: AngularFireStorage,
        private firestore: AngularFirestore,
        private snackbarService: SnackbarService,
        private businessService: BusinessService) {
    }

    uploadImageToBusinessGallery(file: File, business: BusinessModel): Observable<number> {
        let guid: string = Guid.newGuid();
        let fileName: string = 'business-gallery/' + guid + '_' + file.name;

        let ref = this.afStorage.ref(fileName);
        let task = ref.put(file);
        let firestore = this.firestore;
        let uploadProgress$ = task.snapshotChanges()
            .pipe(map(function (s) {
                let progress = (s.bytesTransferred / s.totalBytes) * 100;
                if (progress === 100) {
                    let urlSub = ref.getDownloadURL().subscribe(url => {
                        if (url) {
                            if (!business.photoGallery) {
                                business.photoGallery = new Array<string>();
                            }
                            if (business.photoGallery.indexOf(url) === -1) {
                                business.photoGallery.push(url);
                                let json = BusinessModel.toJson(business);
                                firestore.collection('Businesses').doc(business.guid).set(json);
                                //urlSub.unsubscribe();
                            }
                        }
                    });
                }
                return progress;
            }));
        
        return uploadProgress$;
    }

    uploadImageToBusinessLogo(file: File, business: BusinessModel): Observable<number> {
        let guid: string = Guid.newGuid();
        let fileName: string = 'business-logos/' + guid + '_' + file.name;

        let ref = this.afStorage.ref(fileName);
        let task = ref.put(file);
        let firestore = this.firestore;
        let uploadProgress$ = task.snapshotChanges()
            .pipe(map(function (s) {
                let progress = (s.bytesTransferred / s.totalBytes) * 100;
                if (progress === 100) {
                    ref.getDownloadURL().subscribe(url => {
                        business.logo = url;
                        let json = BusinessModel.toJson(business);
                        firestore.collection('Businesses').doc(business.guid).set(json);
                    })
                }
                return progress;
            }));
        return uploadProgress$;
    }

}