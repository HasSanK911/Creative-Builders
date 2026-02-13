import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWhyChooseUsComponent } from './add-why-choose-us.component';

describe('AddWhyChooseUsComponent', () => {
  let component: AddWhyChooseUsComponent;
  let fixture: ComponentFixture<AddWhyChooseUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWhyChooseUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWhyChooseUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
