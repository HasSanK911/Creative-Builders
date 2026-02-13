import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent {
  contactData = {
    phone: '',
    email: '',
    address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  };

  saveContactDetails() {
    console.log('Saving contact details:', this.contactData);
    if (!this.contactData.phone || !this.contactData.email || !this.contactData.address) {
      alert('Please fill in all required contact information fields.');
      return;
    }
    alert('Contact details saved successfully! (This is a placeholder)');
  }

  resetForm() {
    this.contactData = {
      phone: '',
      email: '',
      address: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    };
  }
}
