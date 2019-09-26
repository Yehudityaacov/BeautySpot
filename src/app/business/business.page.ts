import { Component, OnInit } from '@angular/core';
import { BusinessService, BusinessModel } from '../../services/business.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-business',
  templateUrl: './business.page.html',
  styleUrls: ['./business.page.scss'],
})
export class BusinessPage implements OnInit {

    public businesses$: Observable<BusinessModel[]>;
    public filterSubject$: BehaviorSubject<FilterModel>;

    constructor(private service: BusinessService) {
        this.businesses$ = service.getBusinessess();
        this.filterSubject$ = new BehaviorSubject<FilterModel>(new FilterModel());
    }

    ngOnInit() {

    }

}

export class FilterModel {
    name: string;
    categories: Array<string>;
}