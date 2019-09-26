import {
    Component,
    OnInit,
    Input,
    Output,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    ChangeDetectorRef,
    ViewEncapsulation,
    OnDestroy,
    EventEmitter
} from '@angular/core';
import {
    CalendarEvent,
    CalendarEventTitleFormatter,
    CalendarView,
    CalendarEventAction,
    CalendarModule
} from 'angular-calendar';
import { DayViewHourSegment } from 'calendar-utils';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek, startOfWeek, addHours } from 'date-fns';

import * as moment from 'moment';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { CreateEventComponent } from './create-event/create-event.component';
import { CalendarReservationModel } from 'src/Models/calendarReservationModel.model';
import { CalendarMode } from 'src/Models/calendarMode.enum';
import { AppointmentsDictionaryModel } from 'src/services/appointment.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { selectAppointments } from 'src/state-management/selectors/appointments/appointments.selector';
import { forEach } from '@angular/router/src/utils/collection';
import { UserModel } from '../../Models/user.model';
import { selectUser } from '../../state-management/selectors/user/user.selector';

function floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
}

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
    weekTooltip(event: CalendarEvent, title: string) {
        return super.weekTooltip(event, title);
    }

    dayTooltip(event: CalendarEvent, title: string) {
        return super.dayTooltip(event, title);
    }
}


const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'app-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, OnDestroy {

    @Input()
    public calendarMode: CalendarMode = CalendarMode.Edit;

    @Input()
    public daysToExclude: Array<number> = new Array<number>();

    @Input()
    public minHour: number = 0;

    @Input()
    public maxHour: number = 24;

    @Input()
    public eventDefaultLength: number | null = null;

    @Output()
    public eventCreated: EventEmitter<CalendarReservationModel> = new EventEmitter<CalendarReservationModel>();

    @Output()
    public eventEdited: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public dateChanged: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public eventDeleted: EventEmitter<CalendarEvent> = new EventEmitter<CalendarEvent>();

    private user: UserModel;

    private subscriptions: Array<Subscription> = new Array<Subscription>();

    public events: CalendarEvent[] = [];

    viewDate = new Date();

    dragToCreateActive = false;

    constructor(private cdr: ChangeDetectorRef,
        public modalController: ModalController,
        public actionSheetController: ActionSheetController,
        private store: Store<IAppState>) { }

    ngOnInit(): void {
        let appointments$: Observable<AppointmentsDictionaryModel> = this.store.pipe(select(selectAppointments));
        this.subscriptions.push(appointments$.subscribe(appointments => {
            if (appointments && !appointments.isEmpty()) {
                let allAppointments = appointments.getAllAppointments();
                this.events = [];
                for (var i = 0; i < allAppointments.length; i++) {
                    if (allAppointments[i].fromHour && allAppointments[i].fromHour.seconds && allAppointments[i].fromHour.seconds > 0) {
                        this.events.push({
                            start: new Date(allAppointments[i].fromHour.seconds * 1000),
                            end: new Date(allAppointments[i].toHour.seconds * 1000),
                            title: this.calendarMode === CalendarMode.Edit ? allAppointments[i].name : 'תור',
                            color: colors.red,
                            actions: this.actions,
                            resizable: {
                                beforeStart: true,
                                afterEnd: true
                            },
                            draggable: true,
                            meta: {
                                userId: allAppointments[i].userId
                            }
                        });
                    }

                }

                this.refresh();
            }
        }));

        let user$: Observable<UserModel> = this.store.pipe(select(selectUser));

        this.subscriptions.push(user$.subscribe(user => {
            if (user && user.uid) {
                this.user = user;
            }
        }))

    }

    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                alert('edit');
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                alert('delete');
            }
        }
    ];





    async startDragToCreate(
        segment: DayViewHourSegment,
        mouseDownEvent: MouseEvent,
        segmentElement: HTMLElement
    ) {
        if (this.calendarMode !== CalendarMode.Edit) {
            return;
        }
        let model = new CalendarReservationModel();
        model.fromHourString = moment(segment.date).format("HH:mm");
        model.fromDate = segment.date;
        if (this.user && this.user.username) {
            model.name = this.user.username;
        }
        if (this.eventDefaultLength && this.eventDefaultLength > 0) {
            model.toDate = addHours(segment.date, this.eventDefaultLength);
            model.toHourString = moment(model.toDate).format("HH:mm");
        }
        const modal = await this.modalController.create({
            component: CreateEventComponent,
            componentProps: {
                model: model,
                mode: CalendarMode.Edit
            }
        });

        modal.onDidDismiss().then((data) => {
            if (data && data.data && data.data.event) {
                let model: CalendarReservationModel = data.data.event;

                const dragToSelectEvent: CalendarEvent = {
                    id: this.events.length,
                    title: model.name,
                    start: model.fromDate,
                    end: model.toDate,
                    actions: this.actions,
                };
                this.events = [...this.events, dragToSelectEvent];
                this.refresh();
                this.eventCreated.emit(model);
            }
        });
        return await modal.present();


    }

    private refresh() {
        this.events = [...this.events];
        this.cdr.detectChanges();
    }
    public onDateChanged(viewDate: Date) {
        var start = startOfWeek(viewDate);
        var end = endOfWeek(viewDate);

        this.dateChanged.emit({
            start: start,
            end: end
        });
    }

    public getDateRange(viewDate: Date) {
        var start = moment(startOfWeek(viewDate)).format('DD/MM/YYYY');
        var end = moment(endOfWeek(viewDate)).format('DD/MM/YYYY');
        return start + '-' + end;
    }

    public headerClick(day) {
        var dateStr = moment(day.date).format('DD/MM/YYYY');
        alert('day selected: ' + dateStr);
    }

    public getDateStr(date) {
        var dateStr = moment(date).format('DD/MM/YYYY');
        return dateStr;
    }

    public async onEventClick($event) {
        let buttons = [];
        if (this.calendarMode === CalendarMode.Edit) {
            buttons.push({
                text: 'Delete',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.eventDeleted.emit($event);
                }
            });
            buttons.push({
                text: 'Edit',
                icon: 'share',
                handler: () => {
                    this.openEvent($event, CalendarMode.Edit);
                }
            })
        } else {

            if ($event.meta.userId === this.user.uid) {
                buttons.push({
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.eventDeleted.emit($event);
                    }
                });
                buttons.push({
                    text: 'Edit',
                    icon: 'share',
                    handler: () => {
                        this.openEvent($event, CalendarMode.Edit);
                    }
                })
            } else {
                buttons.push({
                    text: 'Show',
                    icon: 'eye',
                    handler: () => {
                        this.openEvent($event, CalendarMode.View);
                    }
                });
            }

        }
        buttons.push({
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
        })
        const actionSheet = await this.actionSheetController.create({
            header: 'Edit Event',
            buttons: buttons
        });
        await actionSheet.present();


    }

    public async openEvent(event: CalendarEvent, mode: CalendarMode) {
        let model = new CalendarReservationModel();
        model.fromHourString = moment(event.start).format("HH:mm");
        model.fromDate = event.start;
        model.toHourString = moment(event.end).format("HH:mm");
        model.toDate = event.end;
        model.name = event.title;
        const modal = await this.modalController.create({
            component: CreateEventComponent,
            componentProps: {
                model: model,
                mode: CalendarMode.Edit
            }
        });

        modal.onDidDismiss().then((data) => {
            if (data && data.data && data.data.event) {

                this.eventEdited.emit({
                    oldAppointment: data.data.oldEvent,
                    newAppointment: data.data.event,
                });

                //let model: CalendarReservationModel = data.data.event;

                //const dragToSelectEvent: CalendarEvent = {
                //    id: data.data.event.id,
                //    title: model.name,
                //    start: model.fromDate,
                //    end: model.toDate,
                //    actions: this.actions,
                //};
                //this.events = this.events.filter(e => e.id !== dragToSelectEvent.id)
                //this.events = [...this.events, dragToSelectEvent];
                //this.refresh();
            }
        });
        return await modal.present();
    }
}

