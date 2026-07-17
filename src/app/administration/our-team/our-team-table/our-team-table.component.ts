import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { TeamMember } from '../../../models/api.models';

@Component({
  selector: 'app-our-team-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './our-team-table.component.html',
  styleUrl: './our-team-table.component.css'
})
export class OurTeamTableComponent implements OnInit {

  members: TeamMember[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private api: ApiService<TeamMember>) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.api.getAll('team-members').subscribe({
      next: rows => {
        this.members = rows;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  remove(member: TeamMember): void {
    if (!confirm(`Delete team member ${member.name}?`)) {
      return;
    }

    this.api.delete(`team-members/${member.id}`).subscribe({
      next: () => this.load(),
      error: err => this.error = err.message
    });
  }
}
