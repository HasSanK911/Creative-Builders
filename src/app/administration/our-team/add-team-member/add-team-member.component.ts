import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../Services/api.service';
import { Site, TeamMember } from '../../../models/api.models';

@Component({
  selector: 'app-add-team-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-team-member.component.html',
  styleUrl: './add-team-member.component.css'
})
export class AddTeamMemberComponent implements OnInit, OnDestroy {

  id: number | null = null;

  name: string = '';
  position: string = '';
  email: string = '';
  phone: string = '';
  siteId: number | null = null;

  sites: Site[] = [];
  isSiteDropdownOpen: boolean = false;

  file: File | null = null;
  /** Object URL of a freshly picked file, or the absolute URL the API handed out. */
  preview: string | null = null;
  private objectUrl: string | null = null;

  loading: boolean = false;
  saving: boolean = false;
  error: string = '';

  constructor(
    private api: ApiService<TeamMember>,
    private siteApi: ApiService<Site>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  get title(): string {
    return this.id ? 'Edit Team Member' : 'Add Team Member';
  }

  get saveLabel(): string {
    if (this.saving) {
      return 'Saving...';
    }
    return this.id ? 'Update Team Member' : 'Save Team Member';
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
    this.api.getById(`team-members/${this.id}`).subscribe({
      next: member => {
        this.name = member.name;
        this.position = member.position;
        this.email = member.email;
        this.phone = member.phone;
        this.siteId = member.siteId;
        this.preview = member.photo;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  selectSite(site: Site): void {
    this.siteId = site.id ?? null;
    this.isSiteDropdownOpen = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.revokeObjectUrl();
    this.file = file;
    this.objectUrl = URL.createObjectURL(file);
    this.preview = this.objectUrl;

    // Let the same file be picked again after another choice.
    input.value = '';
  }

  save(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.error = '';

    // An unchanged photo round-trips as the URL the API handed out.
    const photo$: Observable<string | null> = this.file
      ? this.api.upload(this.file).pipe(map(uploaded => uploaded.path))
      : of(this.preview);

    photo$.pipe(
      switchMap(photo => {
        const payload = {
          photo,
          name: this.name,
          position: this.position,
          email: this.email,
          phone: this.phone,
          siteId: this.siteId
        };

        return this.id
          ? this.api.update(`team-members/${this.id}`, payload)
          : this.api.create('team-members', payload);
      })
    ).subscribe({
      next: () => this.router.navigate(['../team-member-list'], { relativeTo: this.route }),
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
