import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotogalleryPage } from './photogallery.page';

describe('PhotogalleryPage', () => {
  let component: PhotogalleryPage;
  let fixture: ComponentFixture<PhotogalleryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotogalleryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotogalleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
