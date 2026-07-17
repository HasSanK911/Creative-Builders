import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { AuthUser } from '../../models/api.models';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit {
  private readonly endpoint = 'profile';
  /** Shipped with the theme — stands in until the admin uploads a logo. */
  private readonly placeholderLogo = 'assets/images/profile/02.webp';

  profile: Omit<AuthUser, 'id'> = this.blank();

  private logoFile: File | null = null;
  private logoDataUrl: string | null = null;

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService<AuthUser>) { }

  /** A pending pick, then the stored logo, then the placeholder. */
  get logoPreview(): string {
    return this.logoDataUrl ?? this.profile.logo ?? this.placeholderLogo;
  }

  ngOnInit(): void {
    this.load();
  }

  onLogoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.logoFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.logoDataUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  save(): void {
    this.error = null;
    this.success = null;
    this.saving = true;

    // A newly picked file has to be stored first — the profile carries the returned path, not the file.
    if (this.logoFile) {
      this.api.upload(this.logoFile).subscribe({
        next: uploaded => this.put(uploaded.path),
        error: err => this.fail(err),
      });
    } else {
      this.put(this.profile.logo);
    }
  }

  private load(): void {
    this.loading = true;
    this.error = null;

    this.api.getById(this.endpoint).subscribe({
      next: user => {
        this.apply(user);
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  private put(logo: string | null): void {
    this.api.update(this.endpoint, { ...this.profile, logo }).subscribe({
      next: user => {
        this.apply(user);
        this.saving = false;
        this.success = 'Profile updated successfully.';
      },
      error: err => this.fail(err),
    });
  }

  private apply(user: AuthUser): void {
    this.profile = {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      phone: user.phone,
      logo: user.logo,
    };
    this.logoFile = null;
    this.logoDataUrl = null;
  }

  private fail(err: Error): void {
    this.error = err.message;
    this.saving = false;
  }

  private blank(): Omit<AuthUser, 'id'> {
    return {
      name: '',
      email: '',
      companyName: '',
      phone: '',
      logo: null,
    };
  }
}
