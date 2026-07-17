import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PublicContentService } from '../../Services/public-content.service';
import { ImgSrcDirective } from '../../Services/img-src.directive';
import { initThemeScripts } from '../theme-init';
import {
  AboutCompany,
  Banner,
  ContactDetail,
  Faq,
  GalleryItem,
  Service,
  TeamMember,
  Testimonial,
  WhyChooseUs,
} from '../../models/api.models';

/**
 * The theme's own hero slides, kept as the empty state for the banner carousel: with no
 * banners in the database the hero would otherwise be a blank swiper, so we fall back to
 * the content the page shipped with. `image: null` sends each slide to its bundled
 * `slider-img-*` background class — see `bannerBackgroundClass`.
 *
 * The other DEFAULT_* lists below do the same job for their sections.
 */
const DEFAULT_BANNERS: Banner[] = [
  {
    tagline: 'Building Opportunities Creating Value',
    heading: 'Your Trusted Partner in Construction',
    description: 'Quality construction delivers stronger, safer structures with lasting durability. Modern methods cut waste and boost efficiency, creating better homes and a more sustainable environment.',
    image: null,
    buttonText: 'Get Started',
  },
  {
    tagline: 'Innovate, Grow, and Transform Your World',
    heading: 'Building the Future, One Project at a Time',
    description: 'Quality construction delivers stronger, safer structures with lasting durability. Modern methods cut waste and boost efficiency, creating better homes and a more sustainable environment.',
    image: null,
    buttonText: 'Get Started',
  },
  {
    tagline: 'Innovate, Grow, and Transform Your World',
    heading: 'Quality Construction You Can Rely On',
    description: 'Quality construction delivers stronger, safer structures with lasting durability. Modern methods cut waste and boost efficiency, creating better homes and a more sustainable environment.',
    image: null,
    buttonText: 'Get Started',
  },
];

const DEFAULT_SERVICES: Service[] = [
  {
    title: 'Building Construction',
    description: 'For businesses looking to reduce operating costs, enhance sustainability efforts, and demonstrate reduce operating costs.',
    icon: null,
    tag: null,
  },
  {
    title: 'Renovation & Remodeling',
    description: 'We specialize in designing and delivering customized residential solutions that meet your specific needs.',
    icon: null,
    tag: 'Popular',
  },
  {
    title: 'Architecture & Design',
    description: 'We believe every property has unique potential, which is why we specialize in custom architectural design.',
    icon: null,
    tag: null,
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    clientImage: null,
    clientName: 'Bm Alamin',
    designation: 'Designer',
    feedback: 'It has been a wonderful experience. The team was professional and efficient, and the work was delivered on time and on budget.',
    rating: 5,
  },
  {
    clientImage: null,
    clientName: 'Irin Pervin',
    designation: 'Designer',
    feedback: 'It has been a wonderful experience. The team was professional and efficient, and the work was delivered on time and on budget.',
    rating: 5,
  },
];

const DEFAULT_TEAM: TeamMember[] = [
  { photo: null, name: 'James Johnson', position: 'Construction Engineer', email: 'creativebuilders@exm.com', phone: '', siteId: null },
  { photo: null, name: 'William Smith', position: 'Chief Technical Officer', email: 'creativebuilders@exm.com', phone: '', siteId: null },
  { photo: null, name: 'Thomas Brown', position: 'Project Manager', email: 'creativebuilders@exm.com', phone: '', siteId: null },
  { photo: null, name: 'John Taylor', position: 'Electrical Engineer', email: 'creativebuilders@exm.com', phone: '', siteId: null },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  { image: null, title: 'Modern House', siteId: null, siteName: 'Residential Building' },
  { image: null, title: 'Office Block', siteId: null, siteName: 'Commercial Construction' },
  { image: null, title: 'Factory Build', siteId: null, siteName: 'Industrial Project' },
];

const DEFAULT_FAQS: Faq[] = [
  {
    question: 'What is included in project site preparation?',
    answer: 'Site preparation includes land clearing, grading, soil testing, utility planning, and setting up the initial project layout. Our team ensures your construction site is fully ready for structural work to begin smoothly and safely.',
  },
  {
    question: 'How long does it take to complete a construction project?',
    answer: 'Project timelines depend on size, design complexity, materials, and approval procedures. On average, residential projects take 3–6 months, while commercial projects may require 6–12 months.',
  },
  {
    question: 'Do I need permits for construction work?',
    answer: 'Yes, most construction projects require permits for safety and compliance. Our team assists you with all necessary documentation, including building permits, zoning approvals, and environmental clearances.',
  },
  {
    question: 'Is maintenance required after construction?',
    answer: 'Regular maintenance ensures long-term durability of your structure. We offer post-construction support such as inspections, repair services, and warranty coverage depending on the project type.',
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImgSrcDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  companyName = environment.CompanyName;

  banners: Banner[] = [];
  services: Service[] = [];
  testimonials: Testimonial[] = [];
  team: TeamMember[] = [];
  gallery: GalleryItem[] = [];
  faqs: Faq[] = [];
  about: AboutCompany | null = null;
  whyChooseUs: WhyChooseUs | null = null;
  contact: ContactDetail | null = null;

  /** The bundled hero backgrounds, applied slide-by-slide when a banner has no upload. */
  private readonly bannerFallbacks = ['slider-img-01', 'slider-img-eight', 'slider-img-02'];

  /** Same idea for the thumbnail strip under the hero, which uses real <img> tags. */
  private readonly bannerThumbFallbacks = [
    'assets/images/banner/20.webp',
    'assets/images/banner/36.webp',
    'assets/images/banner/37.webp',
  ];

  constructor(private router: Router, private content: PublicContentService) { }

  ngOnInit(): void {
    // One forkJoin rather than nine independent subscriptions, so the theme's sliders are
    // booted exactly once — after every section has its data and Angular has rendered the
    // slides. Booting per response would re-init Swiper up to nine times, each time over a
    // half-populated DOM.
    forkJoin({
      banners: this.content.banners(),
      services: this.content.services(),
      testimonials: this.content.testimonials(),
      team: this.content.teamMembers(),
      gallery: this.content.gallery(),
      faqs: this.content.faqs(),
      about: this.content.aboutCompany(),
      whyChooseUs: this.content.whyChooseUs(),
      contact: this.content.contactDetails(),
    }).subscribe(data => {
      this.banners = data.banners.length ? data.banners : DEFAULT_BANNERS;
      this.services = data.services.length ? data.services : DEFAULT_SERVICES;
      this.testimonials = data.testimonials.length ? data.testimonials : DEFAULT_TESTIMONIALS;
      this.team = data.team.length ? data.team : DEFAULT_TEAM;
      this.gallery = data.gallery.length ? data.gallery : DEFAULT_GALLERY;
      this.faqs = data.faqs.length ? data.faqs : DEFAULT_FAQS;
      this.about = data.about;
      this.whyChooseUs = data.whyChooseUs;
      this.contact = data.contact;

      initThemeScripts();
    });
  }

  /** The bundled background class for a slide whose banner carries no uploaded image. */
  bannerBackgroundClass(banner: Banner, index: number): string {
    return banner.image ? '' : this.bannerFallbacks[index % this.bannerFallbacks.length];
  }

  /** An uploaded banner image is painted over the theme's CSS background. */
  bannerBackgroundImage(banner: Banner): string | null {
    return banner.image ? `url(${banner.image})` : null;
  }

  bannerThumbFallback(index: number): string {
    return this.bannerThumbFallbacks[index % this.bannerThumbFallbacks.length];
  }

  /**
   * The admin form never collects a service icon (it is in the API but not in the UI), so
   * in practice these always fall through to the theme's bundled icon set, cycling so
   * adjacent cards do not repeat.
   */
  serviceIconFallback(index: number): string {
    const icons = [
      'assets/images/banner/icon-07.svg',
      'assets/images/service/icon/30.svg',
      'assets/images/service/icon/32.svg',
      'assets/images/service/icon/26.svg',
      'assets/images/service/icon/27.svg',
      'assets/images/service/icon/28.svg',
    ];

    return icons[index % icons.length];
  }

  /**
   * About-company keeps its three bullets in fixed `feature1`…`feature3` columns rather
   * than a list, so collapse them into one and drop the slots the admin left blank.
   */
  aboutFeatures(): string[] {
    const features = [this.about?.feature1, this.about?.feature2, this.about?.feature3]
      .filter((feature): feature is string => !!feature?.trim());

    return features.length ? features : [
      'Expert in Sustainable & Renewable Building Practices',
      'Professional Construction & Site Management',
      'Coordinator of Residential Construction Projects',
    ];
  }

  /**
   * Why-choose-us also stores its three features as flat numbered columns. The icons are
   * not in the API at all — the admin form never collects one — so the theme's three stay
   * pinned to their positions.
   */
  whyChooseFeatures(): { icon: string; title: string; description: string }[] {
    const icons = ['fa-solid fa-transformer-bolt', 'fa-light fa-bolt', 'fa-regular fa-industry-windows'];
    const w = this.whyChooseUs;

    const fromApi = [
      { title: w?.feature1Title, description: w?.feature1Description },
      { title: w?.feature2Title, description: w?.feature2Description },
      { title: w?.feature3Title, description: w?.feature3Description },
    ]
      .map((feature, i) => ({ ...feature, icon: icons[i] }))
      .filter((feature): feature is { icon: string; title: string; description: string } => !!feature.title?.trim());

    return fromApi.length ? fromApi : [
      {
        icon: icons[0],
        title: 'Cost-Effective Project Plans',
        description: 'We deliver well-structured construction solutions designed to save time and reduce overall project expenses without compromising quality.',
      },
      {
        icon: icons[1],
        title: 'Quality Materials Guaranteed',
        description: 'Our team uses only certified and durable materials, ensuring every structure stands strong and meets industry safety standards.',
      },
      {
        icon: icons[2],
        title: 'Years of Construction Expertise',
        description: 'With extensive experience across residential, commercial, and industrial projects, we bring proven knowledge to every build.',
      },
    ];
  }

  /** The 1–5 rating, as a list to repeat a filled star over. */
  stars(rating: number): number[] {
    return Array(Math.max(0, Math.min(5, rating || 0))).fill(0);
  }

  testimonialFallback(index: number): string {
    const photos = ['assets/images/team/36.webp', 'assets/images/team/11.webp'];

    return photos[index % photos.length];
  }

  /** Bundled project photography, for gallery items with no upload. */
  workFallback(index: number): string {
    const photos = [
      'assets/images/working-process/21.webp',
      'assets/images/working-process/22.webp',
      'assets/images/working-process/23.webp',
    ];

    return photos[index % photos.length];
  }

  teamFallback(index: number): string {
    const photos = [
      'assets/images/team/04.webp',
      'assets/images/team/05.webp',
      'assets/images/team/06.webp',
      'assets/images/team/07.webp',
    ];

    return photos[index % photos.length];
  }

  galleryFallback(index: number): string {
    const photos = [
      'assets/images/gallery/07.webp',
      'assets/images/gallery/08.webp',
      'assets/images/gallery/09.webp',
    ];

    return photos[index % photos.length];
  }

  telHref(phone: string | null | undefined): string {
    return `tel:${(phone ?? '').replace(/\s+/g, '')}`;
  }

  gotoContactUs() {
    this.router.navigate(['/contact-us']);
  }
  gotoaboutus() {
    this.router.navigate(['/about-us']);
  }
  gotoServices() {
    this.router.navigate(['/services']);
  }
  gotoGallery() {
    this.router.navigate(['/gallery']);
  }
}
