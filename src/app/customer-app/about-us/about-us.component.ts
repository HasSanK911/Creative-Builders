import { Component, AfterViewInit } from '@angular/core';
declare var window: any;

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements AfterViewInit {

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
  scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth'
  });
}


}
