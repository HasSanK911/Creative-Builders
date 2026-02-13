import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAboutCompanyDetailsComponent } from './add-about-company-details.component';

describe('AddAboutCompanyDetailsComponent', () => {
  let component: AddAboutCompanyDetailsComponent;
  let fixture: ComponentFixture<AddAboutCompanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAboutCompanyDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAboutCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
