import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-our-team-table',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './our-team-table.component.html',
  styleUrl: './our-team-table.component.css'
})
export class OurTeamTableComponent implements OnInit {
  members: any[] = [];
  isLoading = false;
  message = '';

  constructor(private apiService: ApiService<any>) { }

  ngOnInit(): void { this.loadMembers(); }

  loadMembers() {
    this.isLoading = true;
    this.apiService.getAll('admin/team-members').subscribe({
      next: (res: any) => { this.members = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  deleteMember(id: number) {
    if (!confirm('Delete this team member?')) return;
    this.apiService.delete('admin/team-members', id).subscribe({
      next: () => { this.members = this.members.filter(m => m.id !== id); },
      error: (err: any) => { console.error(err); this.message = 'Delete failed.'; setTimeout(() => this.message = '', 3000); }
    });
  }
}
