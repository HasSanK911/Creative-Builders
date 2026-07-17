import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  loading = false;
  error: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Enter your email and password.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.email, this.password, this.rememberMe).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: err => {
        // A wrong password comes back as Laravel's 422 validation shape.
        this.error = err?.error?.message ?? 'Login failed. Check your email and password.';
        this.loading = false;
      },
    });
  }

  gotoHome() {
    this.router.navigate(['/']);
  }
}
