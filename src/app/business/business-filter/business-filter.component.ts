import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FilterModel } from '../business.page';
import { FormControl } from '@angular/forms';
import { ICategoryModel, CategoryService } from '../../../services/category.service';

@Component({
    selector: 'app-business-filter',
    templateUrl: './business-filter.component.html',
    styleUrls: ['./business-filter.component.scss'],
})
export class BusinessFilterComponent implements OnInit, OnDestroy {

    @Input()
    public filterSubject$: BehaviorSubject<FilterModel>

    public filter: FilterModel;

    public businessNameControl = new FormControl('');

    public categoryControl = new FormControl('');

    public categories: Array<ICategoryModel>;

    private nameChangeSubscription: Subscription;
    private categoryChangeSubscription: Subscription;

    constructor(private categoryService: CategoryService) {
        this.categories = this.categoryService.getCategories();
    }

    ngOnInit() {
        this.filter = this.filterSubject$.getValue();

        this.nameChangeSubscription = this.businessNameControl.valueChanges.subscribe(v => {
            this.filter.name = v;
            this.filterSubject$.next(this.filter);
        })

        this.categoryChangeSubscription = this.categoryControl.valueChanges.subscribe(v => {
            this.filter.categories = v;
            this.filterSubject$.next(this.filter);
        })
    }

    ngOnDestroy(): void {
        this.nameChangeSubscription.unsubscribe();
    }

}