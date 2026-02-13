import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-team-member',
  standalone: true,
  imports: [],
  templateUrl: './add-team-member.component.html',
  styleUrl: './add-team-member.component.css'
})
export class AddTeamMemberComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.initImageUpload();
    this.initCustomSelects();
  }

  private initImageUpload(): void {
    const uploadBtn = this.el.nativeElement.querySelector('#uploadBtn');
    const fileInput = this.el.nativeElement.querySelector('#fileInput');
    const previewImage = this.el.nativeElement.querySelector('#previewImage');
    const placeholderText = this.el.nativeElement.querySelector('#placeholderText');

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
