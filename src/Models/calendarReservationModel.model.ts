export class CalendarReservationModel {
    fromHourString: string;
    toHourString: string;
    fromDate: Date;
    toDate: Date;
    name: string;

    constructor(data?: CalendarReservationModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

}