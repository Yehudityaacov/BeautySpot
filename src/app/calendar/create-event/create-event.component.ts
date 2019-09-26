import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/common/myErrorStateMatcher';
import { CalendarMode } from 'src/Models/calendarMode.enum';
import { CalendarReservationModel } from 'src/Models/calendarReservationModel.model';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
    
    @Input()
    public model: CalendarReservationModel;

    @Input()
    public mode: CalendarMode;

    public matcher = new MyErrorStateMatcher();

    public isEditMode: boolean;

    public eventNameControl = new FormControl('', [
        Validators.required
    ]);

    private oldModel: CalendarReservationModel;
    private editing: boolean;

    constructor(public modalController: ModalController) { }
    ngOnInit() {
        this.isEditMode = this.mode === CalendarMode.Edit;
        this.oldModel = new CalendarReservationModel(this.model);
        this.editing = this.model.name && this.model.name.length > 0;
    }

    public closeModal() {
        this.modalController.dismiss();
    }

    public accept() {
        this.model.fromDate = this.parseTimeToDate(this.model.fromDate, this.model.fromHourString);
        this.model.toDate = this.parseTimeToDate(this.model.fromDate, this.model.toHourString);
        this.modalController.dismiss({
            event: this.model,
            oldEvent: this.oldModel
        });
    }

    private parseTimeToDate(date: Date, time: string) {
        let timeSpl = time.split(":");
        let ret = new Date(date);
        ret.setHours(parseInt(timeSpl[0]));
        ret.setMinutes(parseInt(timeSpl[1]));
        return ret;
    }

}
