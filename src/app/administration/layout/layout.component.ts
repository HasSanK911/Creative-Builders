import { Component, HostListener, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.initCursorAnimation();
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);

  }


  initCursorAnimation() {
    const cursorOuter = document.querySelector('.cursor-outer') as HTMLElement;
    const cursorInner = document.querySelector('.cursor-inner') as HTMLElement;

    if (cursorOuter && cursorInner) {
      // Mouse move handler
      this.renderer.listen('window', 'mousemove', (e: MouseEvent) => {
        cursorOuter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorInner.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });

      // Hover effects
      const hoverSelectors = 'a, button, .cursor-pointer';

      this.renderer.listen('document', 'mouseenter', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.matches && target.matches(hoverSelectors)) {
          cursorInner.classList.add('cursor-hover');
          cursorOuter.classList.add('cursor-hover');
        }
      });
      // We need to attach listeners to body or document and check target because elements are dynamic
      // But main.js used $('body').on('mouseenter', selector, ...) which is delegated.
      // Angular way for delegated events:
      this.renderer.listen('document', 'mouseover', (event) => {
        const target = event.target as HTMLElement;
        if (target.closest(hoverSelectors)) {
          cursorInner.classList.add('cursor-hover');
          cursorOuter.classList.add('cursor-hover');
        }
      });

      this.renderer.listen('document', 'mouseout', (event) => {
        const target = event.target as HTMLElement;
        if (target.closest(hoverSelectors)) {
          cursorInner.classList.remove('cursor-hover');
          cursorOuter.classList.remove('cursor-hover');
        }
      });

      cursorOuter.style.visibility = 'visible';
      cursorInner.style.visibility = 'visible';
    }
  }

}
