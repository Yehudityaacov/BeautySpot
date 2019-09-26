import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessModel } from 'src/services/business.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

    @Input()
    public bussByCat$: Observable<Array<BusinessModel>>;
    constructor(private router: Router) { }

    ngOnInit() { }

    public businessClicked(b: BusinessModel) {
        this.router.navigateByUrl('business-page/' + b.guid + '/1');
    }

}
