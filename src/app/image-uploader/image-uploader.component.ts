import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Observable } from 'rxjs';
import { IAppState } from '../../state-management/states/app/app.state';
import { Store, select } from '@ngrx/store';
import { BusinessModel, BusinessService } from '../../services/business.service';

import * as actions from '../../state-management/actions/business/business.actions';
import { selectBusiness } from '../../state-management/selectors/business/business.selector';
import { GALLERY_CONF, GALLERY_IMAGE } from 'ngx-image-gallery';
import { NgxGalleryImage, NgxGalleryAnimation, NgxGalleryOptions, NgxGalleryImageSize } from 'ngx-gallery';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit, AfterViewChecked {

    public progress$: Observable<number>;

    @Input()
    public business: BusinessModel;

    @Input()
    public mode: GalleryMode;

    public conf: GALLERY_CONF;

    public images: GALLERY_IMAGE[] = [];

    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    private business$: Observable<BusinessModel>;

    constructor(private imageService: ImageService,
        private modalController: ModalController,
        private businessService: BusinessService) {
    }

    ngOnInit() {

        this.galleryOptions = [
            {
                width: '100vw',
                height: '300px',
                thumbnails: this.mode === GalleryMode.GalleryEdit || this.mode === GalleryMode.GalleryView,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                imageAutoPlayInterval: 1500,

                image: true,
                thumbnailsRemainingCount: true,

                thumbnailsMoveSize: 4,
                imageArrowsAutoHide: false,
                thumbnailsArrowsAutoHide: false,

                imageAutoPlay: true,
                imageAutoPlayPauseOnHover: true,
                previewAutoPlay: true,
                previewAutoPlayPauseOnHover: true,

                imageArrows: true,
                imageSwipe: true,
                thumbnailsArrows: true,
                thumbnailsSwipe: true,
                previewSwipe: true,

                previewFullscreen: true,
                previewKeyboardNavigation: true,

                previewCloseOnClick: true,
                previewCloseOnEsc: true,
                closeIcon: "fa fa-window-close"
            },
            // max-width 800
            {
                breakpoint: 800,
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400
            }
        ];
        this.business$ = this.businessService.getBusByGuid(this.business.guid);

        this.business$.subscribe(b => {
            if (b && b.guid) {
                this.refreshGallery();
            }
        })
        this.refreshGallery();
    }

    ngAfterViewChecked(): void {
        //this.refreshGallery();
    }

    public refreshGallery() {
        if (this.business.photoGallery && this.business.photoGallery.length) {
            if (this.mode === GalleryMode.LogoEdit || this.mode === GalleryMode.LogoView) {
                this.galleryImages = [{
                    big: this.business.logo,
                    small: this.business.logo,
                    medium: this.business.logo
                } as NgxGalleryImage];
        }
        else {
            this.galleryImages = this.business.photoGallery.map(function (p) {
                return {
                    big: p,
                    small: p,
                    medium: p
                } as NgxGalleryImage;
            });
        }

    }
}

    public upload($event) {
    if (this.business && this.business.guid) {
        let file: File = $event.target.files[0];
        if (this.mode === GalleryMode.GalleryEdit) {
            this.progress$ = this.imageService.uploadImageToBusinessGallery(file, this.business);
        }
        else if (this.mode === GalleryMode.LogoEdit) {
            this.progress$ = this.imageService.uploadImageToBusinessLogo(file, this.business);
        }

        this.progress$.subscribe(progress => {
            console.log(progress);
        })
    }

}

    public onUpload() {
    let fileUploadElement = document.getElementById('file-upload');
    fileUploadElement.click();
}


    public closeModal() {
    this.modalController.dismiss();
}
}

export enum GalleryMode {
    GalleryEdit = 0,
    GalleryView = 1,
    LogoView = 2,
    LogoEdit = 3
}