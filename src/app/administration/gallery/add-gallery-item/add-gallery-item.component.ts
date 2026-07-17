import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../Services/api.service';
import { GalleryItem, Site } from '../../../models/api.models';

@Component({
  selector: 'app-add-gallery-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-gallery-item.component.html',
  styleUrl: './add-gallery-item.component.css'
})
export class AddGalleryItemComponent implements OnInit, OnDestroy {

  id: number | null = null;

  title: string = '';
  siteId: number | null = null;

  sites: Site[] = [];
  isSiteDropdownOpen: boolean = false;

  /** One entry per freshly picked file. Object URLs are synchronous, so the order matches. */
  previews: { file: File; url: string }[] = [];
  /** The image already on the record; shown until a replacement is picked. */
  existingImage: string | null = null;
  hoveredPreview: number | null = null;

  loading: boolean = false;
  saving: boolean = false;
  error: string = '';

  constructor(
    private api: ApiService<GalleryItem>,
    private siteApi: ApiService<Site>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  get heading(): string {
    return this.id ? 'Edit Gallery Image' : 'Add Gallery Images';
  }

  get uploadLabel(): string {
    return this.previews.length
      ? `Upload Images (${this.previews.length} selected)`
      : 'Upload Images';
  }

  get saveLabel(): string {
    if (this.saving) {
      return 'Saving...';
    }
    return this.id ? 'Update Gallery Image' : 'Save Gallery Images';
  }

  /** Resolved from the loaded sites, so it survives the site list arriving after the record. */
  get selectedSiteName(): string {
    return this.sites.find(site => site.id === this.siteId)?.name ?? '';
  }

  ngOnInit(): void {
    this.siteApi.getAll('sites').subscribe({
      next: sites => this.sites = sites,
      error: err => this.error = err.message
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) {
      return;
    }

    this.id = Number(id);
    this.loading = true;
    this.api.getById(`gallery/${this.id}`).subscribe({
      next: item => {
        this.title = item.title ?? '';
        this.siteId = item.siteId;
        this.existingImage = item.image;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.clearPreviews();
  }

  selectSite(site: Site): void {
    this.siteId = site.id ?? null;
    this.isSiteDropdownOpen = false;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) {
      return;
    }

    // Editing swaps the one image; adding stacks a batch up for a single submit.
    if (this.id) {
      this.clearPreviews();
    }

    files.forEach(file => {
      const duplicate = this.previews.some(
        preview => preview.file.name === file.name && preview.file.size === file.size
      );
      if (!duplicate) {
        this.previews.push({ file, url: URL.createObjectURL(file) });
      }
    });

    // Let a removed file be picked again.
    input.value = '';
  }

  removeImage(index: number): void {
    URL.revokeObjectURL(this.previews[index].url);
    this.previews.splice(index, 1);
    this.hoveredPreview = null;
  }

  save(): void {
    if (this.saving) {
      return;
    }

    if (!this.previews.length && !this.existingImage) {
      this.error = 'Please choose at least one image.';
      return;
    }

    this.saving = true;
    this.error = '';

    const paths$: Observable<string[]> = this.previews.length
      ? this.api.uploadMany(this.previews.map(preview => preview.file)).pipe(
        map(uploaded => uploaded.map(file => file.path))
      )
      : of([]);

    paths$.pipe(
      switchMap(paths => {
        const title = this.title.trim() || null;

        // An unchanged image round-trips as the URL the API handed out.
        return this.id
          ? this.api.update(`gallery/${this.id}`, {
            image: paths.length ? paths[0] : this.existingImage,
            title,
            siteId: this.siteId
          })
          : this.api.create('gallery', { images: paths, title, siteId: this.siteId });
      })
    ).subscribe({
      next: () => this.router.navigate(['../gallery-item-list'], { relativeTo: this.route }),
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }

  private clearPreviews(): void {
    this.previews.forEach(preview => URL.revokeObjectURL(preview.url));
    this.previews = [];
    this.hoveredPreview = null;
  }
}
