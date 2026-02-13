import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './add-testimonials.component.html',
  styleUrl: './add-testimonials.component.css'
})
export class AddTestimonialsComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.initClientImageUpload();
  }

  private initClientImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#clientUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#clientFileInput');
    const previewImage = this.el.nativeElement.querySelector('#clientPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#clientPlaceholderText');

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
