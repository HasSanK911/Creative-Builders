import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsTableComponent } from './testimonials-table.component';

describe('TestimonialsTableComponent', () => {
  let component: TestimonialsTableComponent;
  let fixture: ComponentFixture<TestimonialsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestimonialsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
