import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { ContactDetail } from '../../models/api.models';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent implements OnInit {
  private readonly endpoint = 'contact-details';

  contactData: ContactDetail = this.blank();

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService<ContactDetail>) { }

  ngOnInit(): void {
    this.load();
  }

  saveContactDetails(): void {
    this.error = null;
    this.success = null;

    if (!this.contactData.phone || !this.contactData.email || !this.contactData.address) {
      this.error = 'Please fill in all required contact information fields.';
      return;
    }

    this.saving = true;

    const payload: ContactDetail = {
      ...this.contactData,
      // The backend validates the socials with `url`, and an empty string fails that rule — null passes.
      facebook: this.blankToNull(this.contactData.facebook),
      twitter: this.blankToNull(this.contactData.twitter),
      instagram: this.blankToNull(this.contactData.instagram),
      linkedin: this.blankToNull(this.contactData.linkedin),
    };

    this.api.update(this.endpoint, payload).subscribe({
      next: row => {
        this.apply(row);
        this.saving = false;
        this.success = 'Contact details saved successfully.';
      },
      error: err => {
        this.error = err.message;
        this.saving = false;
      },
    });
  }

  /** Discards unsaved edits by re-reading the stored row. */
  resetForm(): void {
    this.error = null;
    this.success = null;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.error = null;

    this.api.getById(this.endpoint).subscribe({
      next: row => {
        this.apply(row);
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  private apply(row: ContactDetail): void {
    this.contactData = { ...this.blank(), ...row };
  }

  private blankToNull(value: string | null): string | null {
    const trimmed = (value ?? '').trim();
    return trimmed.length ? trimmed : null;
  }

  private blank(): ContactDetail {
    return {
      phone: '',
      email: '',
      address: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    };
  }
}
