import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
//import { normalizeURL } from '@ionic/angular';
import { UploadService } from 'src/services/upload.service';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { UserService } from 'src/services/user.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { BusinessService, BusinessModel } from 'src/services/business.service';
import { UserModel } from 'src/Models/user.model';
@Component({
    selector: 'app-uploadimage',
    templateUrl: './uploadimage.page.html',
    styleUrls: ['./uploadimage.page.scss'],
})
export class UploadimagePage implements OnInit {

    //// Main task 
    //task: AngularFireUploadTask;



    //snapshot: Observable<any>;

    //// Download URL 
    //downloadURL: Observable<string>;



    desc:string="";
    captureDataUrl: string;
    alertCtrl: AlertController;
    userbid: string;
    public user: UserModel;
    @Input('useURI') useURI: Boolean = true;
    @ViewChild('fileButton') fileButton;
    constructor(public navCtrl: NavController, alertCtrl: AlertController, private buisnessservice: BusinessService,private db: AngularFirestore, public userservice: UserService) {
        this.alertCtrl = alertCtrl;
        this.captureDataUrl = "assets/no-image.jpeg";
    }

    ngOnInit() {
    }

    getPicture(sourceType) {
        const cameraOptions: CameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            sourceType: sourceType,
            //targetWidth: 100,
            //targetHeight: 100,
            //correctOrientation: true,
            //allowEdit: true,
            //saveToPhotoAlbum: false 
        };

        Camera.getPicture(cameraOptions)
            .then((captureDataUrl) => {
                this.captureDataUrl = 'data:image/jpeg;base64,' + captureDataUrl;

            }, (err) => {
                console.log(err);
            });

    }

    upload() {
       // this.fileButton.nativeElment.click();
        let storageRef = firebase.storage().ref();
        // Create a timestamp as filename
        // const filename = Math.floor(Date.now() / 1000);
        this.userbid = this.userservice.getGUID();
        console.log("im here",this.userbid)
     
        //console.log(b.guid)
       // const userbid = this.userservice.getGUID();
        const descreption = this.desc;
        // Create a reference to 'images/todays-date.jpg'
        const imageRef = storageRef.child(`images/${this.generateUUID()}.jpg`);
        const firebasecollction = this.db.doc(`Businesses/${this.userbid}`);
        imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL)
            .then((snapshot) => {
                // Do something here when the data is succesfully uploaded!
           
                snapshot.ref.getDownloadURL().then((downloadURL)=> {
                    console.log("File available at", downloadURL);
                    let image = downloadURL;
                    //firebasecollction.set({ url: myPhotoURL})
                    firebasecollction.update({
                        photoGallery: firebase.firestore.FieldValue.arrayUnion(
                            image,
                            // descreption
                       )
                       
                    });

                   

                    ///this.user.businesses.map(x => x.photoGallery.push(this.captureDataUrl));
                    this.userservice.getUserDetails().businesses.map(x => x.photoGallery.push(this.captureDataUrl));

                }, (err)=> {
                    console.log(err);
                    });
              
                this.showSuccesfulUploadAlert('Uploaded!', 'Picture is uploaded Gallery');
                // Update firestore on completion
                console.log(this.user.businesses);
               

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
        this.captureDataUrl = "";
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
