import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.initImageUpload();
  }

  private initImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#uploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#fileInput');
    const previewImage = this.el.nativeElement.querySelector('#previewImage');

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
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}
