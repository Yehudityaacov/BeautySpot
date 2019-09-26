import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BusinessModel } from '../../../services/business.service';
import { Router } from '@angular/router';
import { FilterModel } from '../business.page';

@Component({
    selector: 'app-business-component',
    templateUrl: './business.component.html',
    styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit, OnDestroy {
    @Input()
    public businesses$: Observable<BusinessModel[]>;

    @Input()
    public filter$: Observable<FilterModel>;

    public filteredBusinesses: BusinessModel[];
    private allBusinesses: BusinessModel[];

    private subscriptions: Array<Subscription> = new Array<Subscription>();

    constructor(private router: Router) { }

    ngOnInit() {
        this.subscriptions.push(this.businesses$.subscribe(businesses => {
            this.filteredBusinesses = businesses;
            this.allBusinesses = businesses;
        }));
        this.subscriptions.push(this.filter$.subscribe(filter => {
            this.filteredBusinesses = this.allBusinesses;
            if (filter.name) {
                this.filteredBusinesses = this.filteredBusinesses.filter(b => b.name.indexOf(filter.name) !== -1);
            }
            if (filter.categories && filter.categories.length) {
                this.filteredBusinesses = this.filteredBusinesses.filter(b => filter.categories.indexOf(b.category) !== -1);
            }
        }));
    }

    public businessClicked(b: BusinessModel) {
        this.router.navigateByUrl('business-page/' + b.guid + '/1');
    }

    ngOnDestroy(): void {
        for (var i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }


}
