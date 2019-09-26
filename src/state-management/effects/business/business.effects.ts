import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable } from "@angular/core";
import { IAppState } from 'src/state-management/states/app/app.state';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { BusinessService } from 'src/services/business.service';
import { Observable, of } from 'rxjs';
import * as actions from '../../actions/business/business.actions';
import { nearer } from 'q';
import { flatMap, map, catchError } from 'rxjs/operators';
import { SnackbarService } from 'src/services/snackbar.service';

@Injectable()
export class BusinessEffects {
    constructor(private store$: Store<IAppState>,
        private actions$: Actions,
        private businessService: BusinessService,
        private snackbarService: SnackbarService) { }

    @Effect()
    getBusinesses$: Observable<Action> = this.actions$.pipe(
        ofType<actions.GetBusinesses>(actions.BusinessActionTypes.GetBusinesses),
        flatMap((action) => {
            return this.businessService.getBusinessess()
                .map(x => {
                    return new actions.GetBusinessesSuccess(x);
                })
                .catch(err => {
                    return of(new actions.GetBusinessesFailure(err));
                });
        })
    );
    @Effect()
    getBusinessesByCategory$: Observable<Action> = this.actions$.pipe(
        ofType<actions.GetBusinessesByCategory>(actions.BusinessActionTypes.GetBusinessesByCategory),
        flatMap((action) => {
            return this.businessService.getBusByCat(action.payload)
                .map(x => {
                    return new actions.GetBusinessesByCategorySuccess(x);
                })
                .catch(err => {
                    return of(new actions.GetBusinessesByCategoryFailure(err));
                });
        })
    );

    @Effect()
    getBusinessById$: Observable<Action> = this.actions$.pipe(
        ofType<actions.GetBusinessById>(actions.BusinessActionTypes.GetBusinessById),
        flatMap((action) => {
            return this.businessService.getBusByGuid(action.payload)
                .map(x => {
                    return new actions.GetBusinessByIdSuccess(x);
                })
                .catch(err => {
                    return of(new actions.GetBusinessByIdFailure(err));
                });
        })
    );

    @Effect()
    editBusiness$: Observable<Action> = this.actions$.pipe(
        ofType<actions.EditBusiness>(actions.BusinessActionTypes.EditBusiness),
        flatMap((action) => {
            return this.businessService.editBusiness(action.payload.business, action.payload.isNew, action.payload.user)
                .map(x => {
                    this.snackbarService.showToast('העסק נערך בהצלחה');
                    return new actions.EditBusinessSuccess(x);
                })
                .catch(err => {
                    return of(new actions.EditBusinessFailure(err));
                });
        })
    );

}