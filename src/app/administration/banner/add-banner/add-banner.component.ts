import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Banner } from '../../../models/api.models';

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit {
  bannerId: number | null = null;

  /** Preview src: a data URL while a new file is staged, the stored absolute URL in edit mode. */
  selectedImage: string | null = null;
  /** Held in memory until save — uploaded first, then its path goes out with the banner. */
  imageFile: File | null = null;

  banner: Banner = {
    tagline: '',
    heading: '',
    description: '',
    image: null,
    buttonText: ''
  };

  loading = false;
  saving = false;
  error: string | null = null;

  constructor(private api: ApiService<Banner>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) return;

    this.bannerId = Number(id);
    this.loading = true;

    this.api.getById(`banners/${this.bannerId}`).subscribe({
      next: banner => {
        this.banner = banner;
        this.selectedImage = banner.image;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.imageFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  saveBanner() {
    this.saving = true;
    this.error = null;

    if (this.imageFile) {
      this.api.upload(this.imageFile).subscribe({
        next: uploaded => this.persist(uploaded.path),
        error: err => this.fail(err)
      });
      return;
    }

    // No new file: editing re-sends the image it was handed, adding sends nothing.
    this.persist(this.banner.image);
  }

  private persist(image: string | null) {
    const payload: Banner = { ...this.banner, image };

    const save = this.bannerId
      ? this.api.update(`banners/${this.bannerId}`, payload)
      : this.api.create('banners', payload);

    save.subscribe({
      next: () => this.router.navigate(['../banner-list'], { relativeTo: this.route }),
      error: err => this.fail(err)
    });
  }

  private fail(err: Error) {
    this.error = err.message;
    this.saving = false;
  }

  resetForm() {
    this.banner = {
      tagline: '',
      heading: '',
      description: '',
      image: null,
      buttonText: ''
    };
    this.selectedImage = null;
    this.imageFile = null;
  }
}
