import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
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
  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
