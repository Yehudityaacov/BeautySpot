import { IAppState } from "src/state-management/states/app/app.state";
import { createSelector } from '@ngrx/store';
import { IUserState } from 'src/state-management/states/user/user.state';


const selectUserState = (state: IAppState) => state.user;
export const selectUser = createSelector(
    selectUserState,
    (userState: IUserState) => userState.user
);