import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-services-detail',
  standalone: true,
  imports: [],
  templateUrl: './add-services-detail.component.html',
  styleUrl: './add-services-detail.component.css'
})
export class AddServicesDetailComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.initHeroImageUpload();
    this.initSecondaryImageUpload();
  }

  private initHeroImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#heroUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#heroFileInput');
    const previewImage = this.el.nativeElement.querySelector('#heroPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#heroPlaceholderText');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (previewImage) {
              previewImage.src = e.target.result;
              previewImage.style.display = 'block';
            }
            if (placeholderText) {
              placeholderText.style.display = 'none';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  private initSecondaryImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#secondaryUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#secondaryFileInput');
    const previewImage = this.el.nativeElement.querySelector('#secondaryPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#secondaryPlaceholderText');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (previewImage) {
              previewImage.src = e.target.result;
              previewImage.style.display = 'block';
            }
            if (placeholderText) {
              placeholderText.style.display = 'none';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}
