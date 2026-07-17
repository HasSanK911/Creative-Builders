import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PublicContentService } from '../../Services/public-content.service';
import { ImgSrcDirective } from '../../Services/img-src.directive';
import { initThemeScripts } from '../theme-init';
import { ContactDetail, GalleryItem } from '../../models/api.models';

/** One tab of the project grid: "All Works" plus one per site that has images. */
interface GalleryTab {
  label: string;
  items: GalleryItem[];
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { image: null, title: 'Modern Residential Building Design', siteId: null, siteName: 'Construction' },
  { image: null, title: 'Urban High-Rise Apartment Projects', siteId: null, siteName: 'Construction' },
  { image: null, title: 'Corporate Office Construction Works', siteId: null, siteName: 'Commercial' },
  { image: null, title: 'Industrial Warehouse Development', siteId: null, siteName: 'Industrial' },
  { image: null, title: 'Bridge & Infrastructure Works', siteId: null, siteName: 'Bridge' },
  { image: null, title: 'Luxury Villa Interior Finishing', siteId: null, siteName: 'Construction' },
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, ImgSrcDirective],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  tabs: GalleryTab[] = [];
  contact: ContactDetail | null = null;

  constructor(private router: Router, private content: PublicContentService) { }

  ngOnInit(): void {
    forkJoin({
      gallery: this.content.gallery(),
      contact: this.content.contactDetails(),
    }).subscribe(data => {
      const items = data.gallery.length ? data.gallery : DEFAULT_GALLERY;

      this.tabs = this.groupBySite(items);
      this.contact = data.contact;

      initThemeScripts();
    });
  }

  /**
   * The page shipped with five fixed category tabs (Construct Building, Bridge, …), but
   * gallery items carry no category — what they do carry is the site they belong to. So
   * the tabs are built from the sites actually present, which keeps the filter useful and
   * means it grows by itself as the admin adds sites.
   */
  private groupBySite(items: GalleryItem[]): GalleryTab[] {
    const bySite = new Map<string, GalleryItem[]>();

    for (const item of items) {
      const site = item.siteName?.trim() || 'Other Projects';

      bySite.set(site, [...(bySite.get(site) ?? []), item]);
    }

    // A lone site tab would just duplicate "All Works", so only add the per-site tabs
    // once there is more than one site to choose between.
    const siteTabs = bySite.size > 1
      ? [...bySite.entries()].map(([label, tabItems]) => ({ label, items: tabItems }))
      : [];

    return [{ label: 'All Works', items }, ...siteTabs];
  }

  /** Bundled project photography, for gallery rows whose image never got uploaded. */
  imageFallback(index: number): string {
    const photos = [
      'assets/images/project/04.webp',
      'assets/images/project/05.webp',
      'assets/images/project/06.webp',
      'assets/images/project/07.webp',
      'assets/images/project/08.webp',
      'assets/images/project/09.webp',
      'assets/images/project/10.webp',
    ];

    return photos[index % photos.length];
  }

  telHref(phone: string | null | undefined): string {
    return `tel:${(phone ?? '').replace(/\s+/g, '')}`;
  }

  gotocontactUs() {
    this.router.navigate(['/contact-us']);
  }
}
