import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/common/myErrorStateMatcher';
import { BusinessModel, Pricing, OpeningHours } from 'src/services/business.service';
import { CategoryService, ICategoryModel } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { selectBusiness } from 'src/state-management/selectors/business/business.selector';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { UploadService } from 'src/services/upload.service';
import { GalleryMode, ImageUploaderComponent } from 'src/app/image-uploader/image-uploader.component';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-edit-business',
    templateUrl: './edit-business.component.html',
    styleUrls: ['./edit-business.component.scss'],
})
export class EditBusinessComponent implements OnInit, OnDestroy {

    @Input()
    public business: BusinessModel;

    @Output()
    public businessSaved: EventEmitter<BusinessModel> = new EventEmitter<BusinessModel>();

    public categories: Array<ICategoryModel>;

    public containerBottomMargin: number = 60;

    public openingHoursArr: Array<any> = new Array<any>();
    public days: any = {
        1: "יום ראשון",
        2: "יום שני",
        3: "יום שלישי",
        4: "יום רביעי",
        5: "יום חמישי",
        6: "יום שישי",
        7: "יום שבת"
    }
    public maxLength: number = 30;
    public businessNameControl = new FormControl('', Validators.maxLength(this.maxLength));
    public addressControl = new FormControl('', Validators.maxLength(this.maxLength));
    public phoneFormControl = new FormControl('', [
        Validators.required,
        Validators.pattern("(([0-9]{3}|[0-9]{2})(-)?[0-9]{7})")
    ]);
    public categoryFormControl: FormControl = new FormControl('', Validators.required);
    public matcher = new MyErrorStateMatcher();
    public catSelection: string;

    private subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(private categoryService: CategoryService, private router: Router, private uploadservice: UploadService,
        private store: Store<IAppState>,
        @Inject('moment') public moment,
        public modalController: ModalController) {
        this.categories = categoryService.getCategories();
    }

    ngOnInit() {
        let business$ = this.store.pipe(select(selectBusiness));
        this.subscriptions.push(business$.subscribe(business => {
            this.initOpeningHours(business);
        }))
    }

    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    private initOpeningHours(business: BusinessModel) {
        this.openingHoursArr = new Array<any>();
        for (var i = 1; i < 8; i++) {
            let tmp = new OpeningHours();
            tmp.day = i;
            let op = (business && business.openingHours) ? business.openingHours.filter(b => b.day === i) : [];
            if (op.length) {
                tmp.fromHour = op[0].fromHour;
                tmp.toHour = op[0].toHour;
                this.openingHoursArr.push({
                    openingHours: tmp,
                    enabled: true
                });
            } else {
                this.openingHoursArr.push({
                    openingHours: tmp,
                    enabled: false
                });
            }
        }
    }

    public addPricing() {
        let newPricing: Pricing = new Pricing();
        if (!this.business.pricing) {
            this.business.pricing = new Array<Pricing>();
        }
        this.business.pricing = this.business.pricing.filter(p => p.price && p.name);
        this.business.pricing.push(newPricing);
    }

    public saveChanges() {
        this.business.openingHours = new Array<OpeningHours>();
        for (var i = 0; i < this.openingHoursArr.length; i++) {
            if (this.openingHoursArr[i].enabled) {
                let openingHours = new OpeningHours();
                openingHours.day = this.openingHoursArr[i].openingHours.day;
                openingHours.fromHour = this.openingHoursArr[i].openingHours.fromHour;
                openingHours.toHour = this.openingHoursArr[i].openingHours.toHour;
                this.business.openingHours.push(openingHours);
            }
        }
        //console.log(this.business);
        this.businessSaved.emit(this.business);
    }

    public addMargin(margin: number) {
        this.containerBottomMargin += margin;
    }

    public uploadImageGallery() {
        
        this.router.navigateByUrl('uploadimage');
    }
    public uploadLogo() {
        this.uploadservice.getPicture(0);
    }

    public async editGallery() {
        const modal = await this.modalController.create({
            component: ImageUploaderComponent,
            componentProps: {
                business: this.business,
                mode: GalleryMode.GalleryEdit
            }
        });

        modal.onDidDismiss().then((data) => {
        });
        return await modal.present();
    }
}

