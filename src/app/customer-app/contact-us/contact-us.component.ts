import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PublicContentService } from '../../Services/public-content.service';
import { initThemeScripts } from '../theme-init';
import { ContactDetail, ContactQuery, HelpTopic } from '../../models/api.models';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  companyName = environment.CompanyName;

  contact: ContactDetail | null = null;

  /** The three "How Can We Help?" checkboxes, kept as a map so the template can bind each one. */
  readonly helpTopics: HelpTopic[] = ['Individual', 'Residential', 'Commercial'];
  selectedTopics: Record<HelpTopic, boolean> = {
    Individual: false,
    Residential: false,
    Commercial: false,
  };

  query: ContactQuery = this.emptyQuery();

  sending = false;
  sendError: string | null = null;
  sent = false;

  constructor(private content: PublicContentService) { }

  ngOnInit(): void {
    this.content.contactDetails().subscribe(contact => {
      this.contact = contact;

      initThemeScripts();
    });
  }

  /** Posts the form to the admin panel's inbox (`POST /api/public/contact-queries`). */
  sendQuery(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sending = true;
    this.sendError = null;
    this.sent = false;

    this.content
      .submitContactQuery({ ...this.query, helpTopics: this.checkedTopics() })
      .subscribe({
        next: () => {
          this.sending = false;
          this.sent = true;
          this.query = this.emptyQuery();
          this.selectedTopics = { Individual: false, Residential: false, Commercial: false };
          form.resetForm();
        },
        error: err => {
          this.sending = false;
          this.sendError = err.message;
        }
      });
  }

  private checkedTopics(): HelpTopic[] {
    return this.helpTopics.filter(topic => this.selectedTopics[topic]);
  }

  private emptyQuery(): ContactQuery {
    return { name: '', email: '', phone: '', message: '', helpTopics: [] };
  }

  /** The five social slots the theme renders, minus the ones left unset in the admin. */
  socials(): { icon: string; url: string }[] {
    const c = this.contact;

    return [
      { icon: 'fa-brands fa-facebook-f', url: c?.facebook },
      { icon: 'fa-brands fa-twitter', url: c?.twitter },
      { icon: 'fa-brands fa-instagram', url: c?.instagram },
      { icon: 'fa-brands fa-linkedin-in', url: c?.linkedin },
    ].filter((social): social is { icon: string; url: string } => !!social.url?.trim());
  }

  telHref(phone: string | null | undefined): string {
    return `tel:${(phone ?? '').replace(/\s+/g, '')}`;
  }
}
