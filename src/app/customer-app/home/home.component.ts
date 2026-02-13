import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
declare var window: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  constructor(private router: Router) { }
  gotoContactUs() {
    this.router.navigate(['/contact-us']);
  }
  gotoaboutus() {
    this.router.navigate(['/about-us']);
  }
  gotoServices() {
    this.router.navigate(['/services']);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (window.invJs) {
        window.invJs.swiperJs();
        window.invJs.odoMeter();
        window.invJs.salActive();
        window.invJs.magnificPopupActivation();
        window.invJs.dataCss();
      }
    }, 500);
  }

}
