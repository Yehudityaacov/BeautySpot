import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../common/myErrorStateMatcher';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import * as bactions from '../../state-management/actions/business/business.actions';
import { selectBusiness } from 'src/state-management/selectors/business/business.selector';
import { BusinessModel, Pricing } from 'src/services/business.service';
import { selectUser } from '../../state-management/selectors/user/user.selector';
import { UploadService } from 'src/services/upload.service';
import { Guid } from '../../Models/guid';
import { UserModel } from '../../Models/user.model';
import { GalleryMode, ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { ModalController } from '@ionic/angular';


@Component({
    selector: 'app-business-page',
    templateUrl: './business-page.page.html',
    styleUrls: ['./business-page.page.scss'],
})
export class BusinessPagePage implements OnInit, OnDestroy {

    public canEdit: boolean = false;
    public isNew: boolean = false;
    private user: UserModel;

    public business: BusinessModel = new BusinessModel();
    private subscriptions = new Array<Subscription>();
    public business$: Observable<BusinessModel>;
    constructor(private route: ActivatedRoute,
        private store: Store<IAppState>,
        private router: Router, private uploadService: UploadService,
        private modalController: ModalController) {
        this.subscriptions.push(this.route.params.subscribe
            ((params) => {
                this.isNew = params.bid == 0;
                let user$ = this.store.pipe(select(selectUser));
                this.subscriptions.push(user$.subscribe(user => {
                    if (user && user.uid) {
                        if (!user.businesses) {
                            user.businesses = [];
                        }
                        this.user = user;
                        let userBusinesses = user.businesses.map(u => u.guid);
                        let businessId = params.bid;
                        let filtered = userBusinesses.filter(b => b === businessId);
                        this.canEdit = params.view == 0 && (params.bid == 0 || (filtered && filtered.length && filtered.length > 0));
                    }
                }))
                if (params.bid == 0) {
                    let business: BusinessModel = new BusinessModel();
                    business.guid = Guid.newGuid();
                    this.business$ = of(business);

                } else {
                    this.store.dispatch(new bactions.GetBusinessById(params.bid));
                    this.business$ = this.store.pipe(select(selectBusiness));
                }
                this.subscriptions.push(this.business$.subscribe(business => {
                    if (business && business.guid) {
                        this.business = business;
                    }
                }));
            })
        );
    }
    ngOnInit() {
    }
    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
    public showCalendar() {
        this.router.navigateByUrl('business-calendar');
    }

    public onBusinessSaved($event: BusinessModel) {
        this.store.dispatch(new bactions.EditBusiness({
            business: $event,
            isNew: this.isNew,
            user: this.user
        }));
    }
    public uploadLogo() {
        this.uploadService.getPicture(0);
    }

    public getBusinessLogo() {
        var ret = {};
        if (this.business.logo) {
            ret['background-image'] = "url('" + this.business.logo + "')";
        } else {
            ret['background-image'] = "url('/assets/eyesSquared.jpg')";
        }
        return ret;
    }

    public async onLogoClick() {
        let galleryMode: GalleryMode = this.canEdit ? GalleryMode.LogoEdit : GalleryMode.LogoView;
        const modal = await this.modalController.create({
            component: ImageUploaderComponent,
            componentProps: {
                business: this.business,
                mode: galleryMode
            }
        });

        modal.onDidDismiss().then((data) => {
        });
        return await modal.present();
    }

    //public uploadImage() {
    //    this.router.navigateByUrl('uploadimage');
    //   // this.uploadService.getPicture(0);
    //}---created just for testing
}
