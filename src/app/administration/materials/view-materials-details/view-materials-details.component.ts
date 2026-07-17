import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { Material, MaterialPurchase, MaterialPurchaseReport, Site } from '../../../models/api.models';

@Component({
  selector: 'app-view-materials-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-materials-details.component.html',
  styleUrl: './view-materials-details.component.css'
})
export class ViewMaterialsDetailsComponent implements OnInit {
  materialId: number = 0;
  materialName: string = '';
  materialUnit: string = '';

  sites: Site[] = [];

  /** Sent to the API. `null` is the "All Sites" option — the param is then omitted entirely. */
  filterSiteId: number | null = null;
  /** The selected site's name, kept only so the button label and the print header can show it. */
  filterSite: string = '';
  filterDateFrom: string = '';
  filterDateTo: string = '';
  isSiteDropdownOpen: boolean = false;

  purchases: MaterialPurchase[] = [];

  // Computed server-side over the filtered rows — displayed as received, never recomputed here.
  totalQuantity: number = 0;
  totalAmount: number = 0;
  averageRate: number = 0;

  loading: boolean = false;
  error: string = '';

  constructor(
    private api: ApiService<Material>,
    private reportApi: ApiService<MaterialPurchaseReport>,
    private siteApi: ApiService<Site>,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'No material selected.';
      return;
    }

    this.materialId = id;
    this.loadMaterial();
    this.loadSites();
    this.loadPurchases();
  }

  private loadMaterial(): void {
    this.api.getById(`materials/${this.materialId}`).subscribe({
      next: material => {
        this.materialName = material.name;
        this.materialUnit = material.unit;
      },
      error: err => this.error = err.message
    });
  }

  private loadSites(): void {
    this.siteApi.getAll('sites').subscribe({
      next: sites => this.sites = sites,
      error: err => this.error = err.message
    });
  }

  private loadPurchases(): void {
    this.loading = true;
    this.error = '';

    this.reportApi.getById(this.purchasesEndpoint()).subscribe({
      next: report => {
        this.purchases = report.purchases ?? [];
        this.totalQuantity = report.totalQuantity;
        this.totalAmount = report.totalAmount;
        this.averageRate = report.averageRate;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.purchases = [];
        this.totalQuantity = 0;
        this.totalAmount = 0;
        this.averageRate = 0;
        this.loading = false;
      }
    });
  }

  /** Only the filters that are actually set are sent; all three params are optional. */
  private purchasesEndpoint(): string {
    const params = new URLSearchParams();
    if (this.filterSiteId !== null) {
      params.set('siteId', String(this.filterSiteId));
    }
    if (this.filterDateFrom) {
      params.set('dateFrom', this.filterDateFrom);
    }
    if (this.filterDateTo) {
      params.set('dateTo', this.filterDateTo);
    }

    const query = params.toString();
    return `materials/${this.materialId}/purchases${query ? `?${query}` : ''}`;
  }

  applyFilters() {
    this.loadPurchases();
  }

  /** `null` is the "All Sites" option. */
  selectSiteFilter(site: Site | null) {
    this.filterSiteId = site?.id ?? null;
    this.filterSite = site?.name ?? '';
    this.isSiteDropdownOpen = false;
  }

  clearFilters() {
    this.filterSiteId = null;
    this.filterSite = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.loadPurchases();
  }

  downloadReport() {
    window.print();
  }
}
