import { Component, OnInit, Input, AfterContentInit, AfterViewInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/common/myErrorStateMatcher';
import { BusinessModel, Pricing, OpeningHours } from 'src/services/business.service';
import { CategoryService } from 'src/services/category.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PaypalComponent } from '../../payments/paypal/paypal.component';
import { InfoComponent, InfoType } from './info/info.component';
import { ImageUploaderComponent, GalleryMode } from '../../image-uploader/image-uploader.component';

@Component({
    selector: 'app-view-business',
    templateUrl: './view-business.component.html',
    styleUrls: ['./view-business.component.scss'],
})
export class ViewBusinessComponent implements OnInit, AfterViewChecked {
    public categoryName: string;
    public maxLength: number = 30;
    public catSelection: string;

 
    @Input()
    public business: BusinessModel;
    constructor(private categoryService: CategoryService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router,
        public modalController: ModalController) { }

    ngOnInit() {
        this.iconRegistry.addSvgIcon(
            'fb-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon/facebook.svg'));

        this.iconRegistry.addSvgIcon(
            'insta-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon/instagram.svg'));
    }

    ngAfterViewChecked(): void {
        this.categoryName = this.categoryService.getCategoryName(this.business.category);
    }

    public navToFb() {
        window.open(this.business.facebook, "_blank");      
    }

    public navToIg() {
        window.open(this.business.instagram, "_blank");
    }

     public viewImageGallery() {
         this.router.navigateByUrl('photogallery');
    }

    public async showPayPal() {
        const modal = await this.modalController.create({
            component: PaypalComponent,
            componentProps: {
                business: this.business
            }
        });

        modal.onDidDismiss().then((data) => {

        });
        return await modal.present();
    }

    public async showInfo(type: InfoType) {
        const modal = await this.modalController.create({
            component: InfoComponent,
            componentProps: {
                business: this.business,
                infoType: type  
            }
        });

        modal.onDidDismiss().then((data) => {
        });
        return await modal.present();
    }

    public async showGallery() {
        const modal = await this.modalController.create({
            component: ImageUploaderComponent,
            componentProps: {
                business: this.business,
                mode: GalleryMode.GalleryView
            }
        });

        modal.onDidDismiss().then((data) => {
        });
        return await modal.present();

    }
}

