import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PublicContentService } from '../../../Services/public-content.service';
import { AboutCompany, ContactDetail } from '../../../models/api.models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  contact: ContactDetail | null = null;
  about: AboutCompany | null = null;

  /** The copyright line used to be filled in by the theme's jQuery (`#year`). */
  readonly year = new Date().getFullYear();

  constructor(private router: Router, private content: PublicContentService) { }

  ngOnInit(): void {
    this.content.contactDetails().subscribe(contact => this.contact = contact);
    this.content.aboutCompany().subscribe(about => this.about = about);
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
}
