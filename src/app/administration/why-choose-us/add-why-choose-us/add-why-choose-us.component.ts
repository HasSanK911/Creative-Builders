import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-why-choose-us',
  standalone: true,
  imports: [],
  templateUrl: './add-why-choose-us.component.html',
  styleUrl: './add-why-choose-us.component.css'
})
export class AddWhyChooseUsComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.initMainImageUpload();
  }

  private initMainImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#mainUploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#mainFileInput');
    const previewImage = this.el.nativeElement.querySelector('#mainPreviewImage');
    const placeholderText = this.el.nativeElement.querySelector('#mainPlaceholderText');

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
