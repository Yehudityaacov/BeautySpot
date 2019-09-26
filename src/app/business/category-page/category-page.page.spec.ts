import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPagePage } from './category-page.page';

describe('CategoryPagePage', () => {
  let component: CategoryPagePage;
  let fixture: ComponentFixture<CategoryPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
