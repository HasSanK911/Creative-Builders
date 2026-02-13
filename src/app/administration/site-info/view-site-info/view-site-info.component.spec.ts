import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSiteInfoComponent } from './view-site-info.component';

describe('ViewSiteInfoComponent', () => {
  let component: ViewSiteInfoComponent;
  let fixture: ComponentFixture<ViewSiteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSiteInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSiteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
