import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadimagePage } from './uploadimage.page';

describe('UploadimagePage', () => {
  let component: UploadimagePage;
  let fixture: ComponentFixture<UploadimagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadimagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadimagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
