import { Component, HostListener } from '@angular/core';
import { HeaderComponent } from "../partials/header/header.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../partials/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 300) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);
  }

}
