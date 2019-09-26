import { initialBusinessState, IBusinessState } from 'src/state-management/states/business/business.state';
import * as actions from "../../actions/business/business.actions";
import { BusinessModel } from 'src/services/business.service';

export function businessReducer(
    state = initialBusinessState,
    action: actions.BusinessActions): IBusinessState {
    switch (action.type) {
        case actions.BusinessActionTypes.GetBusinesses:
        case actions.BusinessActionTypes.GetBusinessesByCategory:
            return {
                ...state,
                businesses: initialBusinessState.businesses
            };

        case actions.BusinessActionTypes.GetBusinessesSuccess:
        case actions.BusinessActionTypes.GetBusinessesByCategorySuccess:
            return {
                ...state,
                businesses: action.payload
            }
        case actions.BusinessActionTypes.GetBusinessById:
            return {
                ...state,
                business: initialBusinessState.business
            };

        case actions.BusinessActionTypes.GetBusinessByIdSuccess:
            return {
                ...state,
                business: action.payload
            }


        case actions.BusinessActionTypes.EditBusinessSuccess:
            let businesses: Array<BusinessModel> = new Array<BusinessModel>();
            for (var i = 0; i < state.businesses.length; i++) {
                if (state.businesses[i].guid === action.payload.guid) {
                    businesses.push(action.payload);
                } else {
                    businesses.push(state.businesses[i]);
                }
            }
            return {
                ...state,
                businesses: businesses
            }
        default:
            return state;
    }
}