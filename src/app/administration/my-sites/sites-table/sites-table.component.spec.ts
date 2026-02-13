import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesTableComponent } from './sites-table.component';

describe('SitesTableComponent', () => {
  let component: SitesTableComponent;
  let fixture: ComponentFixture<SitesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitesTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
