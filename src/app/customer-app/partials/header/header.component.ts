import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PublicContentService } from '../../../Services/public-content.service';
import { ImgSrcDirective } from '../../../Services/img-src.directive';
import { ContactDetail, Service } from '../../../models/api.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ImgSrcDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  contact: ContactDetail | null = null;

  /** Feeds the "Popular Services" grid inside the search offcanvas. */
  services: Service[] = [];

  constructor(private router: Router, private content: PublicContentService) { }

  ngOnInit(): void {
    this.content.contactDetails().subscribe(contact => this.contact = contact);
    this.content.services().subscribe(services => this.services = services.slice(0, 6));
  }

  /** `tel:` hrefs cannot carry spaces, so `+92 324 588007` has to become `+92324588007`. */
  telHref(phone: string | null | undefined): string {
    return `tel:${(phone ?? '').replace(/\s+/g, '')}`;
  }

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
