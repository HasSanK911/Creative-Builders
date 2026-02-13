import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryTableComponent } from './gallery-table.component';

describe('GalleryTableComponent', () => {
  let component: GalleryTableComponent;
  let fixture: ComponentFixture<GalleryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GalleryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
