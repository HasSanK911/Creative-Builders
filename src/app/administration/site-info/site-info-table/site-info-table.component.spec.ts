import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteInfoTableComponent } from './site-info-table.component';

describe('SiteInfoTableComponent', () => {
  let component: SiteInfoTableComponent;
  let fixture: ComponentFixture<SiteInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteInfoTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
