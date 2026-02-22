import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-faq',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-faq.component.html',
  styleUrl: './add-faq.component.css'
})
export class AddFaqComponent implements OnInit {
  faq: any = { question: '', answer: '' };
  isSaving = false;
  isLoading = false;
  message = '';
  isEditMode = false;
  faqId: string | null = null;

  constructor(
    private apiService: ApiService<any>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.faqId = this.route.snapshot.paramMap.get('id');
    if (this.faqId) {
      this.isEditMode = true;
      this.fetchFaq();
    }
  }

  fetchFaq() {
    this.isLoading = true;
    this.apiService.getById(`admin/faqs/${this.faqId}`).subscribe({
      next: (res: any) => {
        this.faq = res;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error loading FAQ details.';
        this.isLoading = false;
      }
    });
  }

  saveFaq() {
    if (!this.faq.question || !this.faq.answer) {
      this.message = 'Please fill in both question and answer.';
      setTimeout(() => this.message = '', 3000);
      return;
    }
    this.isSaving = true;

    const request = this.isEditMode
      ? this.apiService.update(`admin/faqs/${this.faqId}`, this.faq)
      : this.apiService.create('admin/faqs', this.faq);

    request.subscribe({
      next: () => {
        this.message = this.isEditMode ? 'FAQ updated successfully!' : 'FAQ saved successfully!';
        this.isSaving = false;
        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/admin/faq-list']);
        }, 2000);
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Failed to save FAQ.';
        this.isSaving = false;
        setTimeout(() => this.message = '', 3000);
      }
    });
  }
}
