import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PublicContentService } from '../../Services/public-content.service';
import { ImgSrcDirective } from '../../Services/img-src.directive';
import { initThemeScripts } from '../theme-init';
import { AboutCompany, ContactDetail, GalleryItem } from '../../models/api.models';

const DEFAULT_GALLERY: GalleryItem[] = [
  { image: null, title: 'Modern House', siteId: null, siteName: 'Residential Building' },
  { image: null, title: 'Office Block', siteId: null, siteName: 'Commercial Construction' },
  { image: null, title: 'Factory Build', siteId: null, siteName: 'Industrial Project' },
];

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, ImgSrcDirective],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  about: AboutCompany | null = null;
  contact: ContactDetail | null = null;
  gallery: GalleryItem[] = [];

  constructor(private content: PublicContentService) { }

  ngOnInit(): void {
    forkJoin({
      about: this.content.aboutCompany(),
      contact: this.content.contactDetails(),
      gallery: this.content.gallery(),
    }).subscribe(data => {
      this.about = data.about;
      this.contact = data.contact;
      this.gallery = data.gallery.length ? data.gallery : DEFAULT_GALLERY;

      initThemeScripts();

      // This page owns the only [data-parallax] elements, so it starts the parallax loop.
      // It stays off everywhere else (it runs every frame). It has to come after the
      // slider markup exists, hence its place here rather than in ngAfterViewInit.
      (window as any).ParallaxScroll?.initOnce();
    });
  }

  /** About-company keeps its bullets in fixed `feature1`…`feature3` columns. */
  aboutFeatures(): string[] {
    const features = [this.about?.feature1, this.about?.feature2, this.about?.feature3]
      .filter((feature): feature is string => !!feature?.trim());

    return features.length ? features : [
      'Expert in Sustainable & Renewable Building Practices',
      'Professional Construction & Site Management',
      'Coordinator of Residential Construction Projects',
    ];
  }

  workFallback(index: number): string {
    const photos = [
      'assets/images/working-process/21.webp',
      'assets/images/working-process/22.webp',
      'assets/images/working-process/23.webp',
    ];

    return photos[index % photos.length];
  }

  telHref(phone: string | null | undefined): string {
    return `tel:${(phone ?? '').replace(/\s+/g, '')}`;
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
