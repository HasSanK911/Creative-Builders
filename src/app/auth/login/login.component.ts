import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) { }
  ngAfterViewInit() {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);

  }
  gotoAdmin() {
    this.router.navigate(['/admin']);
  }
  gotoHome() {
    this.router.navigate(['/']);
  }
}
