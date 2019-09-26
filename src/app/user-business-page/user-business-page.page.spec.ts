import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBusinessPagePage } from './user-business-page.page';

describe('UserBusinessPagePage', () => {
  let component: UserBusinessPagePage;
  let fixture: ComponentFixture<UserBusinessPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBusinessPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBusinessPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
