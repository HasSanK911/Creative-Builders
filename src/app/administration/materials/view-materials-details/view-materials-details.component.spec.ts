import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMaterialsDetailsComponent } from './view-materials-details.component';

describe('ViewMaterialsDetailsComponent', () => {
  let component: ViewMaterialsDetailsComponent;
  let fixture: ComponentFixture<ViewMaterialsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMaterialsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewMaterialsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
