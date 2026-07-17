import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Service } from '../../../models/api.models';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css'
})
export class AddServiceComponent implements OnInit {
  serviceId: number | null = null;

  service: Service = {
    title: '',
    description: ''
  };

  loading = false;
  saving = false;
  error: string | null = null;

  constructor(private api: ApiService<Service>, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) return;

    this.serviceId = Number(id);
    this.loading = true;

    this.api.getById(`services/${this.serviceId}`).subscribe({
      next: service => {
        // This form collects only title/description — icon and tag are never sent back,
        // so the values the public site uses stay untouched server-side.
        this.service = { title: service.title, description: service.description };
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  saveService() {
    this.saving = true;
    this.error = null;

    const save = this.serviceId
      ? this.api.update(`services/${this.serviceId}`, this.service)
      : this.api.create('services', this.service);

    save.subscribe({
      next: () => this.router.navigate(['../service-list'], { relativeTo: this.route }),
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }
}
