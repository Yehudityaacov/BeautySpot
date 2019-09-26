import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessModel } from 'src/services/business.service';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/state-management/states/app/app.state';
import { selectBusinesses } from 'src/state-management/selectors/business/business.selector';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.page.html',
  styleUrls: ['./category-page.page.scss'],
})
export class CategoryPagePage implements OnInit {

    public bussinessByCat$: Observable<BusinessModel[]>;

    constructor(private store: Store<IAppState>) {
        this.bussinessByCat$ = this.store.pipe(select(selectBusinesses));

    }
  ngOnInit() {
  }

}
