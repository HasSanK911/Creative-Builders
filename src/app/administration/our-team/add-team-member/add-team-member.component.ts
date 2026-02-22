import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-add-team-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-team-member.component.html',
  styleUrl: './add-team-member.component.css'
})
export class AddTeamMemberComponent implements AfterViewInit, OnInit {

  isUploading: boolean = false;
  isSaving: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  selectedImageFile: File | null = null;
  isEditMode: boolean = false;
  memberId: string | null = null;

  member: any = {
    name: '',
    position: '',
    email: '',
    phone: '',
    image_url: ''
  };

  constructor(
    private el: ElementRef,
    private apiService: ApiService<any>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id');
    if (this.memberId) {
      this.isEditMode = true;
      this.fetchMember();
    }
  }

  fetchMember() {
    this.isLoading = true;
    this.apiService.getById(`admin/team-members/${this.memberId}`).subscribe({
      next: (res: any) => {
        this.member = res;
        this.isLoading = false;
        // Update preview after data load if in edit mode
        setTimeout(() => this.updateImagePreview(res.image_url), 100);
      },
      error: (err: any) => {
        console.error(err);
        this.message = 'Error loading team member details.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initImageUpload();
    this.initCustomSelects();
    if (this.isEditMode && this.member.image_url) {
      this.updateImagePreview(this.member.image_url);
    }
  }

  private updateImagePreview(url: string | null): void {
    if (!url) return;
    const previewImage = this.el.nativeElement.querySelector('#previewImage');
    const placeholderText = this.el.nativeElement.querySelector('#placeholderText');
    if (previewImage) {
      previewImage.src = url;
      previewImage.style.display = 'block';
    }
    if (placeholderText) {
      placeholderText.style.display = 'none';
    }
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
          this.selectedImageFile = file;
          // Local preview for UX
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

  saveMember() {
    if (!this.member.name) {
      this.message = 'Please enter the member name.';
      return;
    }

    this.isSaving = true;

    const doSave = () => {
      const request = this.isEditMode
        ? this.apiService.update(`admin/team-members/${this.memberId}`, this.member)
        : this.apiService.create('admin/team-members', this.member);

      request.subscribe({
        next: () => {
          this.message = this.isEditMode ? 'Team member updated successfully!' : 'Team member saved successfully!';
          this.isSaving = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/admin/team-member-list']);
          }, 1500);
        },
        error: (err: any) => {
          console.error('Error saving team member', err);
          this.message = 'Failed to save team member.';
          this.isSaving = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    };

    if (this.selectedImageFile) {
      this.isUploading = true;
      this.apiService.uploadImage(this.selectedImageFile, 'team').subscribe({
        next: (res) => {
          this.member.image_url = res.url;
          this.selectedImageFile = null;
          this.isUploading = false;
          doSave();
        },
        error: (err) => {
          console.error('Image upload failed', err);
          this.message = 'Image upload failed.';
          this.isSaving = false;
          this.isUploading = false;
          setTimeout(() => this.message = '', 3000);
        }
      });
    } else {
      doSave();
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
