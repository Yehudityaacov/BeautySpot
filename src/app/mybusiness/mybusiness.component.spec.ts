import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MybusinessPage } from './mybusiness.page';

describe('MybusinessPage', () => {
  let component: MybusinessPage;
  let fixture: ComponentFixture<MybusinessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybusinessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MybusinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
