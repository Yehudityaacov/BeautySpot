import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GeoFire } from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';
import { Observable } from 'rxjs/Observable';
//import {  } from '../business/business.module';
@Injectable()
export class GeoService {
    //reseve  the resallt 
    dbRef: any;
    geoFire: any;
   //items: Observable<any>;
    hits = new BehaviorSubject([]);
    constructor(private db: AngularFirestore) {
        //a referance to the database -->  firebase update location 
        this.dbRef = this.db.collection('locations').valueChanges();
        this.geoFire = new GeoFire(this.dbRef);


    }
    setLocation(key: string, coords: Array<number>) {
        this.geoFire.set(key, coords)
            .then(_ => console.log('Location updated'))
            .catch(err => console.log(err))
    }
    //Queries database  for nearby locations , the maps to BehaviorSubject
    getLocations(radius: number, coords: Array<number>) {
        this.geoFire.query({
            center: coords,
            radius: radius
        })
            .on('key_entered', (key, location, distance) => {
                let hit = {
                    location: location,
                    distance: distance
                }
                let currenHits = this.hits.value
                currenHits.push(hit)
                this.hits.next(currenHits)
            })
    }
}