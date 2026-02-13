import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicesDetailComponent } from './add-services-detail.component';

describe('AddServicesDetailComponent', () => {
  let component: AddServicesDetailComponent;
  let fixture: ComponentFixture<AddServicesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServicesDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddServicesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
