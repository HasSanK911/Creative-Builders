import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGalleryItemComponent } from './add-gallery-item.component';

describe('AddGalleryItemComponent', () => {
  let component: AddGalleryItemComponent;
  let fixture: ComponentFixture<AddGalleryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGalleryItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGalleryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
