import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-gallery-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-gallery-item.component.html',
  styleUrl: './add-gallery-item.component.css'
})
export class AddGalleryItemComponent implements AfterViewInit {

  private selectedFiles: File[] = [];
  isSaving: boolean = false;
  message: string = '';
  sites: any[] = [];
  selectedSiteId: number | null = null;

  constructor(private el: ElementRef, private apiService: ApiService<any>, private router: Router) { }

  ngAfterViewInit(): void {
    this.fetchSites();
    this.initImageUpload();
    this.initCustomSelects();
  }

  fetchSites() {
    this.apiService.getAll('admin/my-sites').subscribe({
      next: (res: any) => { this.sites = res; },
      error: (err: any) => console.error('Error fetching sites:', err)
    });
  }

  /** Upload all selected images to Cloudinary then save URLs */
  saveGallery() {
    if (this.selectedFiles.length === 0) {
      this.message = 'Please select at least one image.';
      setTimeout(() => this.message = '', 3000);
      return;
    }

    this.isSaving = true;
    const uploadPromises = this.selectedFiles.map(file =>
      lastValueFrom(this.apiService.uploadImage(file, 'gallery'))
    );

    Promise.all(uploadPromises).then(results => {
      console.log('[Gallery] Cloudinary results:', results);
      const urls = (results as any[]).map((r: any) => r.url);
      console.log('[Gallery] URLs to save:', urls);
      this.apiService.create('admin/gallery', { images: urls, site_id: this.selectedSiteId }).subscribe({
        next: (res: any) => {
          console.log('[Gallery] DB save success:', res);
          this.message = `${urls.length} image(s) saved to gallery!`;
          this.isSaving = false;
          this.selectedFiles = [];
          // Clear DOM previews
          const grid = this.el.nativeElement.querySelector('#imagePreviewGrid');
          const placeholder = this.el.nativeElement.querySelector('#placeholderText');
          if (grid) grid.querySelectorAll('.image-preview-item').forEach((el: Element) => el.remove());
          if (placeholder) placeholder.style.display = 'block';
          // Navigate to gallery list so user can confirm images were saved
          setTimeout(() => this.router.navigate(['/admin/gallery-item-list']), 1200);
        },
        error: (err: any) => {
          console.error('Gallery save failed', err);
          this.message = `Failed to save gallery: ${err?.message || 'Server error'}`;
          this.isSaving = false;
          setTimeout(() => this.message = '', 5000);
        }
      });
    }).catch(err => {
      console.error('Image upload failed', err);
      this.message = `Upload failed: ${err?.message || 'Check Cloudinary config'}`;
      this.isSaving = false;
      setTimeout(() => this.message = '', 5000);
    });
  }

  private initImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#uploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#fileInput');
    const imagePreviewGrid = this.el.nativeElement.querySelector('#imagePreviewGrid');
    const placeholderText = this.el.nativeElement.querySelector('#placeholderText');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files || []) as File[];
        if (files.length > 0) {
          files.forEach(file => {
            const isDuplicate = this.selectedFiles.some(
              existing => existing.name === file.name && existing.size === file.size
            );
            if (!isDuplicate) {
              this.selectedFiles.push(file);
            }
          });

          if (placeholderText) placeholderText.style.display = 'none';

          if (imagePreviewGrid) {
            const existingPreviews = imagePreviewGrid.querySelectorAll('.image-preview-item');
            existingPreviews.forEach((preview: Element) => preview.remove());
          }

          this.selectedFiles.forEach((file: File, index: number) => {
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (e: any) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.style.cssText = `position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1/1;border:2px solid var(--color-border);`;

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.style.cssText = `width:100%;height:100%;object-fit:cover;`;

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
                removeBtn.style.cssText = `position:absolute;top:5px;right:5px;background:rgba(220,53,69,0.9);color:white;border:none;border-radius:50%;width:25px;height:25px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;`;
                removeBtn.addEventListener('click', () => {
                  const currentIndex = this.selectedFiles.indexOf(file);
                  if (currentIndex > -1) this.selectedFiles.splice(currentIndex, 1);
                  previewItem.remove();
                  const remaining = imagePreviewGrid?.querySelectorAll('.image-preview-item');
                  if (remaining && remaining.length === 0 && placeholderText) {
                    placeholderText.style.display = 'block';
                  }
                  this.updateUploadButtonText();
                });

                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreviewGrid?.appendChild(previewItem);
              };
              reader.readAsDataURL(file);
            }
          });

          this.updateUploadButtonText();
          fileInput.value = '';
        }
      });
    }
  }

  private updateUploadButtonText(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#uploadBtn .btn-text');
    if (uploadBtn) {
      const count = this.selectedFiles.length;
      uploadBtn.textContent = count === 0 ? 'Upload Images' : `Upload Images (${count} selected)`;
    }
  }

  private initCustomSelects(): void {
    let zIndex = 1;
    const selectBtns = this.el.nativeElement.querySelectorAll('.selectBtn');
    selectBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', () => {
        const dropdown = btn.nextElementSibling as HTMLElement;
        if (dropdown) {
          dropdown.classList.toggle('toggle');
          dropdown.style.zIndex = String(zIndex++);
        }
      });
    });
    const options = this.el.nativeElement.querySelectorAll('.option');
    options.forEach((option: HTMLElement) => {
      option.addEventListener('click', () => {
        const dropdown = option.parentElement as HTMLElement;
        dropdown.classList.remove('toggle');
        const selectBtn = option.closest('.select')?.children[0] as HTMLElement;
        if (selectBtn) {
          selectBtn.setAttribute('data-type', option.getAttribute('data-type') || '');
          selectBtn.innerText = option.innerText;
        }
      });
    });
  }
}
