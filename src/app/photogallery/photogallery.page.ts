import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/services/user.service';
import { UserModel } from 'src/Models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-photogallery',
  templateUrl: './photogallery.page.html',
  styleUrls: ['./photogallery.page.scss'],
})
export class PhotogalleryPage implements OnInit {
    BusinessPhotos: any;
    public user$: Observable<UserModel>;
    public user: UserModel;
    constructor(private afstore: AngularFirestore, private userservice: UserService) {
        const photos = afstore.doc(`users/${userservice.getGUID()}`);
        this.BusinessPhotos = photos.valueChanges();
        //for (let i = 0; i < this.BusinessPhotos.length; i++)
        //    this.user.businesses.map(x => x.photoGallery)[i].push(this.BusinessPhotos);
      //  this.business.photoGallery = photos.valueChanges();
    }

  ngOnInit() {
  }
    public addtoGallery() {
          for (let i = 0; i < this.BusinessPhotos.length; i++)
            this.user.businesses.map(x => x.photoGallery)[i].push(this.BusinessPhotos);
        
       
    }
}
