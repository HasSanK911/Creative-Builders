import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) { }
  gotoHome() {
    this.router.navigate(['/']);
  }
  gotoContactUs() {
    this.router.navigate(['/contact-us']);
  }
  gotoAboutUs() {
    this.router.navigate(['/about-us']);
  }
  gotoServices() {
    this.router.navigate(['/services']);
  }
  gotoGallery() {
    this.router.navigate(['/gallery']);
  }
}
