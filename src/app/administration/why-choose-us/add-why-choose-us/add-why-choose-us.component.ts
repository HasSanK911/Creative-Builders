import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { WhyChooseUs } from '../../../models/api.models';

@Component({
  selector: 'app-add-why-choose-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-why-choose-us.component.html',
  styleUrl: './add-why-choose-us.component.css'
})
export class AddWhyChooseUsComponent implements OnInit {
  private readonly endpoint = 'why-choose-us';

  data: WhyChooseUs = this.blank();

  private mainImageFile: File | null = null;
  private mainImageDataUrl: string | null = null;

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService<WhyChooseUs>) { }

  /** A pending pick shows as a data URL; otherwise the absolute URL the API handed out. */
  get mainImageUrl(): string | null {
    return this.mainImageDataUrl ?? this.data.mainImage;
  }

  ngOnInit(): void {
    this.load();
  }

  onMainImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.mainImageFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.mainImageDataUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  save(): void {
    this.error = null;
    this.success = null;
    this.saving = true;

    // A newly picked file has to be stored first — the row carries the returned path, not the file.
    if (this.mainImageFile) {
      this.api.upload(this.mainImageFile).subscribe({
        next: uploaded => this.put(uploaded.path),
        error: err => this.fail(err),
      });
    } else {
      this.put(this.data.mainImage);
    }
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

  private put(mainImage: string | null): void {
    this.api.update(this.endpoint, { ...this.data, mainImage }).subscribe({
      next: row => {
        this.apply(row);
        this.saving = false;
        this.success = 'Why Choose Us saved successfully.';
      },
      error: err => this.fail(err),
    });
  }

  private apply(row: WhyChooseUs): void {
    this.data = { ...this.blank(), ...row };
    this.mainImageFile = null;
    this.mainImageDataUrl = null;
  }

  private fail(err: Error): void {
    this.error = err.message;
    this.saving = false;
  }

  private blank(): WhyChooseUs {
    return {
      sectionLabel: '',
      mainHeading: '',
      mainDescription: '',
      mainImage: null,
      feature1Title: '',
      feature1Description: '',
      feature2Title: '',
      feature2Description: '',
      feature3Title: '',
      feature3Description: '',
    };
  }
}
