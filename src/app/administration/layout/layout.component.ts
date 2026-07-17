import { Component, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../Services/auth.service';

/** Below this width the sidebar is an off-canvas drawer rather than a column. Matches Bootstrap's `lg`. */
const DRAWER_BREAKPOINT = 992;

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnDestroy {

  /** The signed-in admin, cached at login. The sidebar used to hardcode this name. */
  adminName = this.authService.getUser()?.name ?? 'Admin';

  /** Drawer state. Only meaningful below `DRAWER_BREAKPOINT` — above it the sidebar is always visible. */
  sidebarOpen = false;

  private readonly navigation: Subscription;

  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router) {
    // Tapping a menu item should take you there *and* get the drawer out of the way.
    this.navigation = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.closeSidebar());
  }

  ngAfterViewInit() {
    this.initCursorAnimation();
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);

  }

  ngOnDestroy() {
    this.navigation.unsubscribe();
    this.lockBodyScroll(false);
  }

  toggleSidebar() {
    this.setSidebar(!this.sidebarOpen);
  }

  closeSidebar() {
    this.setSidebar(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeSidebar();
  }

  /**
   * Growing past the breakpoint puts the sidebar back in the page flow, so any open drawer
   * state is stale — and its scroll lock would strand the user on a page they cannot scroll.
   */
  @HostListener('window:resize')
  onResize() {
    if (this.sidebarOpen && window.innerWidth >= DRAWER_BREAKPOINT) {
      this.closeSidebar();
    }
  }

  private setSidebar(open: boolean) {
    this.sidebarOpen = open;
    this.lockBodyScroll(open);
  }

  /**
   * Stops the page behind the drawer from scrolling under your finger. The theme scrolls the
   * html element (it already holds `body` at `overflow: hidden`), so both must be held.
   */
  private lockBodyScroll(locked: boolean) {
    const action = locked ? 'addClass' : 'removeClass';

    this.renderer[action](document.documentElement, 'admin-sidebar-open');
    this.renderer[action](document.body, 'admin-sidebar-open');
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
