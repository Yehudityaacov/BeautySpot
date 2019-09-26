import { AppointmentsDictionaryModel } from '../../../services/appointment.service';

export interface IAppointmentState {
    appointments: AppointmentsDictionaryModel;
};

export const initialAppointmentState: IAppointmentState = {
    appointments: new AppointmentsDictionaryModel()
};
