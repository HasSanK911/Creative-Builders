import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../Services/api.service';
import { ServiceDetail } from '../../../models/api.models';

@Component({
  selector: 'app-add-services-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-services-detail.component.html',
  styleUrl: './add-services-detail.component.css'
})
export class AddServicesDetailComponent implements OnInit {
  private readonly endpoint = 'service-details';

  data: ServiceDetail = this.blank();

  private heroImageFile: File | null = null;
  private heroImageDataUrl: string | null = null;
  private secondaryImageFile: File | null = null;
  private secondaryImageDataUrl: string | null = null;

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService<ServiceDetail>) { }

  /** A pending pick shows as a data URL; otherwise the absolute URL the API handed out. */
  get heroImageUrl(): string | null {
    return this.heroImageDataUrl ?? this.data.heroImage;
  }

  get secondaryImageUrl(): string | null {
    return this.secondaryImageDataUrl ?? this.data.secondaryImage;
  }

  ngOnInit(): void {
    this.load();
  }

  onHeroImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.heroImageFile = file;
    this.readAsDataUrl(file, url => (this.heroImageDataUrl = url));
  }

  onSecondaryImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.secondaryImageFile = file;
    this.readAsDataUrl(file, url => (this.secondaryImageDataUrl = url));
  }

  save(): void {
    this.error = null;
    this.success = null;
    this.saving = true;

    // Either image may be a fresh pick; each has to become a stored path before the row can carry it.
    forkJoin({
      heroImage: this.resolveImage(this.heroImageFile, this.data.heroImage),
      secondaryImage: this.resolveImage(this.secondaryImageFile, this.data.secondaryImage),
    }).subscribe({
      next: images => this.put(images),
      error: err => this.fail(err),
    });
  }

  private resolveImage(file: File | null, current: string | null): Observable<string | null> {
    return file ? this.api.upload(file).pipe(map(uploaded => uploaded.path)) : of(current);
  }

  private put(images: { heroImage: string | null; secondaryImage: string | null }): void {
    this.api.update(this.endpoint, { ...this.data, ...images }).subscribe({
      next: row => {
        this.apply(row);
        this.saving = false;
        this.success = 'Service details saved successfully.';
      },
      error: err => this.fail(err),
    });
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

  private apply(row: ServiceDetail): void {
    this.data = { ...this.blank(), ...row };
    this.heroImageFile = null;
    this.heroImageDataUrl = null;
    this.secondaryImageFile = null;
    this.secondaryImageDataUrl = null;
  }

  private readAsDataUrl(file: File, done: (url: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => done(reader.result as string);
    reader.readAsDataURL(file);
  }

  private fail(err: Error): void {
    this.error = err.message;
    this.saving = false;
  }

  private blank(): ServiceDetail {
    return {
      mainTitle: '',
      mainDescription: '',
      heroImage: null,
      secondaryImage: null,
      benefitsTitle: '',
      benefitsDescription: '',
      servicesHeading: '',
      servicesDescription: '',
      detail1Title: '',
      detail1Description: '',
      detail2Title: '',
      detail2Description: '',
      detail3Title: '',
      detail3Description: '',
      benefit1Title: '',
      benefit1Description: '',
      benefit2Title: '',
      benefit2Description: '',
      benefit3Title: '',
      benefit3Description: '',
      benefit4Title: '',
      benefit4Description: '',
      benefit5Title: '',
      benefit5Description: '',
      benefit6Title: '',
      benefit6Description: '',
    };
  }
}
