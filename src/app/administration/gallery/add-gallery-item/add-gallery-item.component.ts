import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-gallery-item',
  standalone: true,
  imports: [],
  templateUrl: './add-gallery-item.component.html',
  styleUrl: './add-gallery-item.component.css'
})
export class AddGalleryItemComponent implements AfterViewInit {

  private selectedFiles: File[] = [];

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.initImageUpload();
    this.initCustomSelects();
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
          // Add new files to the selectedFiles array (avoid duplicates by name and size)
          files.forEach(file => {
            const isDuplicate = this.selectedFiles.some(
              existing => existing.name === file.name && existing.size === file.size
            );
            if (!isDuplicate) {
              this.selectedFiles.push(file);
            }
          });

          // Hide placeholder text
          if (placeholderText) {
            placeholderText.style.display = 'none';
          }

          // Clear all previews and re-render from selectedFiles
          if (imagePreviewGrid) {
            const existingPreviews = imagePreviewGrid.querySelectorAll('.image-preview-item');
            existingPreviews.forEach((preview: Element) => preview.remove());
          }

          // Create preview for each selected file
          this.selectedFiles.forEach((file: File, index: number) => {
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = (e: any) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.style.cssText = `
                  position: relative;
                  border-radius: 8px;
                  overflow: hidden;
                  aspect-ratio: 1/1;
                  border: 2px solid var(--color-border);
                `;

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `${file.name}`;
                img.title = file.name;
                img.style.cssText = `
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                `;

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
                removeBtn.style.cssText = `
                  position: absolute;
                  top: 5px;
                  right: 5px;
                  background: rgba(220, 53, 69, 0.9);
                  color: white;
                  border: none;
                  border-radius: 50%;
                  width: 25px;
                  height: 25px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  transition: transform 0.2s;
                `;
                removeBtn.addEventListener('mouseenter', () => {
                  removeBtn.style.transform = 'scale(1.1)';
                });
                removeBtn.addEventListener('mouseleave', () => {
                  removeBtn.style.transform = 'scale(1)';
                });
                removeBtn.addEventListener('click', () => {
                  // Remove from selectedFiles array
                  this.selectedFiles.splice(index, 1);
                  previewItem.remove();

                  // Show placeholder if no images left
                  const remainingPreviews = imagePreviewGrid?.querySelectorAll('.image-preview-item');
                  if (remainingPreviews && remainingPreviews.length === 0 && placeholderText) {
                    placeholderText.style.display = 'block';
                  }

                  // Update the button text
                  this.updateUploadButtonText();
                });

                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                imagePreviewGrid?.appendChild(previewItem);
              };
              reader.readAsDataURL(file);
            }
          });

          // Update button text to show count
          this.updateUploadButtonText();

          // Clear the file input so the same file can be selected again if removed
          fileInput.value = '';
        }
      });
    }
  }

  private updateUploadButtonText(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#uploadBtn .btn-text');
    if (uploadBtn) {
      const count = this.selectedFiles.length;
      if (count === 0) {
        uploadBtn.textContent = 'Upload Images';
      } else {
        uploadBtn.textContent = `Upload Images (${count} selected)`;
      }
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
