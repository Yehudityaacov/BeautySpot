import { Component, OnInit, Input } from '@angular/core';
import { BusinessModel } from 'src/services/business.service';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

    @Input()
    public infoType: InfoType;

    @Input()
    public business: BusinessModel;

    public days: any = {
        1: "ראשון",
        2: "שני",
        3: "שלישי",
        4: "רביעי",
        5: "חמישי",
        6: "שישי",
        7: "שבת",
    }

    constructor(private modalController:ModalController) { }

    ngOnInit() {
    }

    public closeModal() {
        this.modalController.dismiss();
    }

}

export enum InfoType {
    OpeningHours = 0,
    Pricing = 1
}

