import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPagePage } from './business-page.page';

describe('BusinessPagePage', () => {
  let component: BusinessPagePage;
  let fixture: ComponentFixture<BusinessPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
