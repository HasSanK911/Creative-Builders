import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For animations if any

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 menu sections', () => {
    expect(component.menuSections.length).toBe(4);
  });

  it('should toggle section expansion', () => {
    const section = component.menuSections[1]; // Sites Management, initially collapsed
    expect(section.expanded).toBeFalse();

    component.toggleSection(section);
    fixture.detectChanges();
    expect(section.expanded).toBeTrue();

    // UI Verification
    const expandedSection = fixture.nativeElement.querySelector('.submenu-wrapper.expanded');
    expect(expandedSection).toBeTruthy();

    const rotatedIcon = fixture.nativeElement.querySelector('.rotate-icon');
    expect(rotatedIcon).toBeTruthy();

    component.toggleSection(section);
    fixture.detectChanges();
    expect(section.expanded).toBeFalse();
  });
});
