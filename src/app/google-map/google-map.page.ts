import { Component, OnInit } from '@angular/core';
import { GeoService } from './geo.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.page.html',
  styleUrls: ['./google-map.page.scss'],
})
export class GoogleMapPage implements OnInit {

    lat: number;
    lng: number;
    markers: any;

    constructor(private userGeo: GeoService, private afAuth: AngularFireAuth,

        public Navctrl: NavController) { }

    ngOnInit() {
        this.getUserLoction()
        this.userGeo.hits.subscribe(hits => this.markers = hits);
    }
    ///geting the corent position of the user
    private getUserLoction() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;

                //in range of 500 rdius from the current position 
                this.userGeo.getLocations(500, [this.lat, this.lng])
            });

        }
    }
}
