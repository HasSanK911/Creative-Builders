import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  message = '';

  contactData: any = {
    phone: '', email: '', address: '',
    facebook: '', twitter: '', instagram: '', linkedin: ''
  };

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getById('admin/contact-details').subscribe({
      next: (res: any) => {
        if (res?.phone || res?.email) this.contactData = { ...res };
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  saveContactDetails() {
    if (!this.contactData.phone || !this.contactData.email || !this.contactData.address) {
      this.message = 'Please fill in phone, email, and address.';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    this.isSaving = true;
    this.apiService.create('admin/contact-details', this.contactData).subscribe({
      next: () => {
        this.message = 'Contact details saved!';
        this.isSaving = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Failed to save.';
        this.isSaving = false;
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  resetForm() {
    this.contactData = { phone: '', email: '', address: '', facebook: '', twitter: '', instagram: '', linkedin: '' };
  }
}
