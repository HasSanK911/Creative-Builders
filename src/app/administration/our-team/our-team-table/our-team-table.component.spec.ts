import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTeamTableComponent } from './our-team-table.component';

describe('OurTeamTableComponent', () => {
  let component: OurTeamTableComponent;
  let fixture: ComponentFixture<OurTeamTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurTeamTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurTeamTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
