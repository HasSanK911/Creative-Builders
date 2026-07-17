import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  /** Fires when the burger is tapped. The layout owns the sidebar, so it does the opening. */
  @Output() menuToggle = new EventEmitter<void>();

  constructor(private router: Router, private authService: AuthService) { }

  gotoHome() {
    this.router.navigate(['/']);
  }

  Logout() {
    // Revokes the token server-side, clears local storage, then routes to /login.
    this.authService.logout();
  }
}
