import { Component, AfterViewInit } from '@angular/core';
declare var window: any;

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements AfterViewInit {

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
