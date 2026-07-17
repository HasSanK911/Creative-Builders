import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Faq } from '../../../models/api.models';

@Component({
  selector: 'app-add-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-faq.component.html',
  styleUrl: './add-faq.component.css'
})
export class AddFaqComponent implements OnInit {
  faqId: number | null = null;

  faq: Faq = {
    question: '',
    answer: ''
  };

  loading = false;
  saving = false;
  error: string | null = null;

  constructor(private api: ApiService<Faq>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) return;

    this.faqId = Number(id);
    this.loading = true;

    this.api.getById(`faqs/${this.faqId}`).subscribe({
      next: faq => {
        this.faq = faq;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  saveFaq() {
    this.saving = true;
    this.error = null;

    const save = this.faqId
      ? this.api.update(`faqs/${this.faqId}`, this.faq)
      : this.api.create('faqs', this.faq);

    save.subscribe({
      next: () => this.router.navigate(['../faq-list'], { relativeTo: this.route }),
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }
}
