import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqTableComponent } from './faq-table.component';

describe('FaqTableComponent', () => {
  let component: FaqTableComponent;
  let fixture: ComponentFixture<FaqTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
