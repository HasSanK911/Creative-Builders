import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  link: string;
  icon: string;
}

interface MenuSection {
  title: string;
  expanded: boolean;
  items: MenuItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  menuSections: MenuSection[] = [
    {
      title: 'Main',
      expanded: true,
      items: [
        { label: 'Dashboard', link: 'dashboard', icon: 'fa-regular fa-user' },
        { label: 'Profile Settings', link: 'profile-settings', icon: 'fa-regular fa-user' }
      ]
    },
    {
      title: 'Sites Management',
      expanded: false,
      items: [
        { label: 'My Sites', link: 'my-sites', icon: 'fa-regular fa-user-pen' },
        { label: 'Sites Info', link: 'site-info-table', icon: 'fa-regular fa-bag-shopping' },
        // { label: 'Materials', link: 'materials-list', icon: 'fa-regular fa-address-card' }
      ]
    },
    {
      title: 'Content Management',
      expanded: false,
      items: [
        { label: 'Gallery', link: 'gallery-item-list', icon: 'fa-light fa-treasure-chest' },
        { label: 'Our Team', link: 'team-member-list', icon: 'fa-regular fa-heart' },
        { label: 'Services', link: 'service-list', icon: 'fa-solid fa-cogs' },
        { label: 'Why Choose Us', link: 'why-choose-us', icon: 'fa-solid fa-check-circle' },
        { label: 'Testimonials', link: 'testimonials-list', icon: 'fa-solid fa-quote-left' },
        { label: 'FAQ', link: 'faq-list', icon: 'fa-solid fa-question-circle' },
        { label: 'Banner', link: 'banner-list', icon: 'fa-solid fa-image' }
      ]
    },
    {
      title: 'Company Info',
      expanded: false,
      items: [
        { label: 'About Company', link: 'company-details', icon: 'fa-solid fa-building' },
        { label: 'Contact Us', link: 'contact-details', icon: 'fa-solid fa-envelope' }
      ]
    }
  ];

  ngAfterViewInit() {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1000);
  }

  toggleSection(section: MenuSection) {
    const wasExpanded = section.expanded;
    // Close all sections
    this.menuSections.forEach(s => s.expanded = false);
    // Toggle the clicked section based on its previous state
    section.expanded = !wasExpanded;
  }
}
