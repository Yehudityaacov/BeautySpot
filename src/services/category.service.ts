import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly categories: Array<ICategoryModel> = new Array<ICategoryModel>();

    constructor() {
        this.categories.push({ name: 'מניקור', value: 'meni' });
        this.categories.push({ name: 'פדיקור', value: 'pedi' });
        this.categories.push({ name: 'טיפולי פנים', value: 'face' });
        this.categories.push({ name: 'שיער', value: 'hair' });
        this.categories.push({ name: 'שיזוף', value: 'tan' });
        this.categories.push({ name: 'איפור', value: 'mua' });
    }

    public getCategories(): Array<ICategoryModel> {
        return this.categories;
    }

    public getCategoryName(value: string): string {
        let cat = this.categories.filter(c => c.value === value);
        if (cat && cat.length) {
            return cat[0].name;
        }
        return '';
    }

}

export interface ICategoryModel {
    name: string;
    value: string;
}