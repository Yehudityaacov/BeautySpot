import { Injectable, Input } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { ToastController, NavController, AlertController } from '@ionic/angular';

import { UserService } from './user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { File } from "@ionic-native/file/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera";


// FIREBASE
import * as firebase from "firebase";
import { UserModel } from 'src/Models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    captureDataUrl: string;
    userbid: string;
    // Main task 
    // task: AngularFireUploadTask;

    public user: UserModel;
    logoimage: string;
    // snapshot: Observable<any>;

    // Download URL
    // downloadURL: Observable<string>;

    alertCtrl: AlertController;
    @Input('useURI') useURI: Boolean = true;
    constructor(private file: File, private db: AngularFirestore, private userservice: UserService) {
      
    }
    // Main task 
    getPicture(sourceType) {
        const cameraOptions: CameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            sourceType: sourceType
        };

        Camera.getPicture(cameraOptions)
            .then((captureDataUrl) => {
                this.captureDataUrl = 'data:image/jpeg;base64,' + captureDataUrl;
            }, (err) => {
                console.log(err);
            });
        this.upload();
    }

    upload() {
        let storageRef = firebase.storage().ref();
        // Create a timestamp as filename
        //const filename = Math.floor(Date.now() / 1000);
        this.userbid = this.userservice.getGUID();
        // Create a reference to 'images/todays-date.jpg' in the firestoreage
        const imageRef = storageRef.child(`Photos/${this.generateUUID()}.jpg`);
        let firebasecollction = this.db.doc(`Businesses/${this.userbid}`);
        imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
            .then((snapshot) => {
                // Do something here when the data is succesfully uploaded!
                
            
                snapshot.ref.getDownloadURL().then((downloadURL) =>{
                    console.log("File available at", downloadURL);
                    let logoimage = downloadURL;
                    firebasecollction.update({ logoUrl:logoimage })/// refrence to a collection in the firestore as a fhoto url
                    //this.db.doc('users/' + this.userservice.getUID).update({
                    //    logo: firebase.firestore.FieldValue.arrayUnion({
                    //        path: Url
                    this.logoimage = logoimage;
                    //    })
                    //});----> in case of uploading multiplay images----->>DONT Delete yet!
                });

                // Update firestore on completion


                //this.user.businesses.map(x => x.photoGallery.push(this.captureDataUrl));
                this.userservice.getUserDetails().businesses.map(x => x.logo=this.captureDataUrl);
                //this.showSuccesfulUploadAlert('Uploaded!', ' Logo Picture is uploaded');


            });

    }
    async showSuccesfulUploadAlert(title: string, content: string) {
        const alert = await this.alertCtrl.create({
            header: title,
            message: content,
            buttons: ['OK']
        });

        await alert.present();
        // clear the previous photo data in the variable
       // this.captureDataUrl = "";
    }

    //Create a UIDtamp as filename string name
    private generateUUID(): any {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}