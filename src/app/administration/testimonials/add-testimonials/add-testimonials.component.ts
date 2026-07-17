import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../Services/api.service';
import { Testimonial } from '../../../models/api.models';

@Component({
  selector: 'app-add-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-testimonials.component.html',
  styleUrl: './add-testimonials.component.css'
})
export class AddTestimonialsComponent implements OnInit, OnDestroy {

  id: number | null = null;

  clientName: string = '';
  designation: string = '';
  feedback: string = '';
  /** The select emits "1".."5"; coerced to a number on save. */
  rating: string = '';

  file: File | null = null;
  /** Object URL of a freshly picked file, or the absolute URL the API handed out. */
  preview: string | null = null;
  private objectUrl: string | null = null;

  loading: boolean = false;
  saving: boolean = false;
  error: string = '';

  constructor(
    private api: ApiService<Testimonial>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  get title(): string {
    return this.id ? 'Edit Testimonial' : 'Add Testimonial';
  }

  get saveLabel(): string {
    if (this.saving) {
      return 'Saving...';
    }
    return this.id ? 'Update Testimonial' : 'Save Testimonial';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) {
      return;
    }

    this.id = Number(id);
    this.loading = true;
    this.api.getById(`testimonials/${this.id}`).subscribe({
      next: testimonial => {
        this.clientName = testimonial.clientName;
        this.designation = testimonial.designation;
        this.feedback = testimonial.feedback;
        this.rating = testimonial.rating ? String(testimonial.rating) : '';
        this.preview = testimonial.clientImage;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.revokeObjectUrl();
    this.file = file;
    this.objectUrl = URL.createObjectURL(file);
    this.preview = this.objectUrl;

    // Let the same file be picked again after another choice.
    input.value = '';
  }

  save(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.error = '';

    // An unchanged image round-trips as the URL the API handed out.
    const image$: Observable<string | null> = this.file
      ? this.api.upload(this.file).pipe(map(uploaded => uploaded.path))
      : of(this.preview);

    image$.pipe(
      switchMap(clientImage => {
        const payload = {
          clientImage,
          clientName: this.clientName,
          designation: this.designation,
          feedback: this.feedback,
          rating: this.rating ? Number(this.rating) : null
        };

        return this.id
          ? this.api.update(`testimonials/${this.id}`, payload)
          : this.api.create('testimonials', payload);
      })
    ).subscribe({
      next: () => this.router.navigate(['../testimonials-list'], { relativeTo: this.route }),
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
