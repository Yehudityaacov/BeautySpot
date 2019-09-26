import * as actions from "../../actions/appointments/appointments.actions";
import { initialAppointmentState, IAppointmentState } from '../../states/appointments/appointments.state';
import { AppointmentsDictionaryModel } from 'src/services/appointment.service';

export function appointmentsReducer(
    state = initialAppointmentState,
    action: actions.AppointmentsActions): IAppointmentState {
    switch (action.type) {
        case actions.AppointmentsActionTypes.GetBusinessAppointmentsByDateSuccess:
            {
                let appointments = state.appointments;
                appointments.addAppointments(action.payload.key, action.payload.value);
                let val = new AppointmentsDictionaryModel(appointments);
                return {
                    ...state,
                    appointments: val
                };
            }

        case actions.AppointmentsActionTypes.AddAppointmentSuccess:
        case actions.AppointmentsActionTypes.DeleteAppointmentSuccess:
        case actions.AppointmentsActionTypes.EditAppointmentSuccess:
            {
                let appointments = state.appointments;
                appointments.setAppointments(action.payload.key, action.payload.value);
                let val = new AppointmentsDictionaryModel(appointments);
                return {
                    ...state,
                    appointments: val
                };
            }
        default:
            return state;
    }
}