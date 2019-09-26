import { IAppState } from "src/state-management/states/app/app.state";
import { createSelector } from '@ngrx/store';
import { IBusinessState } from 'src/state-management/states/business/business.state';

const selectBusinessState = (state: IAppState) => state.business;

export const selectBusinesses = createSelector(
    selectBusinessState,
    (businessState: IBusinessState) => businessState.businesses
);
export const selectBusiness = createSelector(
    selectBusinessState,
    (businessState: IBusinessState) => businessState.business
);