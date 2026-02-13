import { Component } from '@angular/core';
import { Router } from '@angular/router';
declare var window: any;

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  constructor(private router: Router) {}
  gotocontactUs() {
    this.router.navigate(['/contact-us']);
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
