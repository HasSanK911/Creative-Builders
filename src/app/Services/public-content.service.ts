import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  AboutCompany,
  Banner,
  ContactDetail,
  ContactQuery,
  Faq,
  GalleryItem,
  Service,
  ServiceDetail,
  TeamMember,
  Testimonial,
  WhyChooseUs,
} from '../models/api.models';

/**
 * Reads the marketing site's content from the unauthenticated `/api/public/*` routes.
 *
 * Every getter is cached with `shareReplay(1)`, because the same content is asked for by
 * several components at once — contact details alone are needed by the header, the footer
 * and the contact page, and without this each would fire its own request on every
 * navigation.
 *
 * A failed request resolves to an empty list (or `null` for the singletons) rather than
 * erroring: the marketing site must still render its bundled placeholder content when the
 * backend is down, which is exactly what the templates fall back to when a field is empty.
 */
@Injectable({ providedIn: 'root' })
export class PublicContentService {
  private banners$?: Observable<Banner[]>;
  private faqs$?: Observable<Faq[]>;
  private services$?: Observable<Service[]>;
  private serviceDetail$?: Observable<ServiceDetail | null>;
  private testimonials$?: Observable<Testimonial[]>;
  private gallery$?: Observable<GalleryItem[]>;
  private teamMembers$?: Observable<TeamMember[]>;
  private aboutCompany$?: Observable<AboutCompany | null>;
  private whyChooseUs$?: Observable<WhyChooseUs | null>;
  private contactDetails$?: Observable<ContactDetail | null>;

  constructor(private api: ApiService<any>) { }

  banners(): Observable<Banner[]> {
    return (this.banners$ ??= this.list<Banner>('public/banners'));
  }

  faqs(): Observable<Faq[]> {
    return (this.faqs$ ??= this.list<Faq>('public/faqs'));
  }

  services(): Observable<Service[]> {
    return (this.services$ ??= this.list<Service>('public/services'));
  }

  serviceDetail(): Observable<ServiceDetail | null> {
    return (this.serviceDetail$ ??= this.single<ServiceDetail>('public/service-details'));
  }

  testimonials(): Observable<Testimonial[]> {
    return (this.testimonials$ ??= this.list<Testimonial>('public/testimonials'));
  }

  gallery(): Observable<GalleryItem[]> {
    return (this.gallery$ ??= this.list<GalleryItem>('public/gallery'));
  }

  teamMembers(): Observable<TeamMember[]> {
    return (this.teamMembers$ ??= this.list<TeamMember>('public/team-members'));
  }

  aboutCompany(): Observable<AboutCompany | null> {
    return (this.aboutCompany$ ??= this.single<AboutCompany>('public/about-company'));
  }

  whyChooseUs(): Observable<WhyChooseUs | null> {
    return (this.whyChooseUs$ ??= this.single<WhyChooseUs>('public/why-choose-us'));
  }

  contactDetails(): Observable<ContactDetail | null> {
    return (this.contactDetails$ ??= this.single<ContactDetail>('public/contact-details'));
  }

  /**
   * Sends the contact page's form to the admin panel's inbox.
   *
   * Unlike the getters above this is neither cached nor error-swallowed: a visitor who
   * fills in the form must be told whether it actually arrived.
   */
  submitContactQuery(query: ContactQuery): Observable<ContactQuery> {
    return this.api.create('public/contact-queries', query) as Observable<ContactQuery>;
  }

  private list<T>(endpoint: string): Observable<T[]> {
    return this.api.getAll(endpoint).pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: false }),
    ) as Observable<T[]>;
  }

  private single<T>(endpoint: string): Observable<T | null> {
    return this.api.getById(endpoint).pipe(
      catchError(() => of(null)),
      shareReplay({ bufferSize: 1, refCount: false }),
    ) as Observable<T | null>;
  }
}
