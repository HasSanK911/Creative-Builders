import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = environment.CompanyName;

  ngOnInit() {
    // Fallback: Remove loader if it's still there after a short delay
    // This handles cases where main.js might fail or run too early/late
    setTimeout(() => {
      const loader = document.querySelector('.loader-wrapper');
      if (loader) {
        loader.remove();
      }
    }, 1000);
  }
}
