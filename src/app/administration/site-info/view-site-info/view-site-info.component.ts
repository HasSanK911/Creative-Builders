import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import {
  ItemSection,
  SiteInfo,
  SiteInfoAttendance,
  SiteInfoItem,
  SITE_INFO_ITEMS
} from '../../../models/api.models';

/** One cell of the 3 x 17 print layout — the same shape the add screen edits. */
interface ItemRow {
  name: string;
  rate: number | null;
  quantity: number | null;
  total: number | null;
}

@Component({
  selector: 'app-view-site-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-site-info.component.html',
  styleUrl: './view-site-info.component.css',
  // Download PDF prints the page. `no-print` / `print-only` / `.print-table` are global, but the
  // two rules the wide sheet needs are only in the add screen's own stylesheet — repeat them here,
  // otherwise `.table-responsive` clips the 16-column attendance table when printed.
  styles: [`
    @media print {
      .table-responsive { overflow: visible !important; }
      .print-page-break { page-break-after: always; break-after: page; }
    }
  `]
})
export class ViewSiteInfoComponent implements OnInit {

  siteInfoId: number | null = null;
  siteInfo: SiteInfo | null = null;

  loading = false;
  error: string | null = null;

  itemsData: Record<ItemSection, ItemRow[]> = this.getInitialItemsState();
  attendanceRows: SiteInfoAttendance[] = [];

  attendanceHeaders: string[] = [
    'Date', "Engineer's Salary", 'Bajri', 'Payment', 'Sand', 'Payment',
    'Bricks', 'Payment', 'Cement', 'Payment', 'Cement -', 'Cement +',
    'Steel', 'Payment', 'Steel +', 'Steel -'
  ];

  attendanceColumns: string[] = [
    'engineerSalary', 'bajri', 'bajriPayment', 'sand', 'sandPayment',
    'bricks', 'bricksPayment', 'cement', 'cementPayment',
    'cementMinus', 'cementPlus', 'steel', 'steelPayment',
    'steelPlus', 'steelMinus'
  ];

  private readonly sections: ItemSection[] = ['left', 'middle', 'right'];

  constructor(private api: ApiService<SiteInfo>, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No site information sheet was requested.';
      return;
    }

    this.siteInfoId = Number(id);
    this.loading = true;

    // This endpoint eager-loads items, attendance and receipts.
    this.api.getById(`site-infos/${this.siteInfoId}`).subscribe({
      next: sheet => {
        this.siteInfo = sheet;
        this.mergeItems(sheet.items ?? []);
        this.attendanceRows = sheet.attendance ?? [];
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  downloadPDF() {
    window.print();
  }

  getSectionTotal(section: ItemSection): number {
    return this.itemsData[section].reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  }

  /** Bracket access on the attendance row, so the 15 columns can be driven off one array. */
  cell(row: SiteInfoAttendance, col: string): number | null {
    return (row as any)[col] ?? null;
  }

  getColumnTotal(col: string): number {
    return this.attendanceRows.reduce((sum, row) => sum + (Number(this.cell(row, col)) || 0), 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'color-warning';
      case 'Dispute': return 'color-danger';
      default: return '';
    }
  }

  /** Dates may arrive as full ISO timestamps — show the day only. */
  formatDate(value: string | null | undefined): string {
    return value ? String(value).slice(0, 10) : '';
  }

  private getInitialItemsState(): Record<ItemSection, ItemRow[]> {
    const toRow = (name: string): ItemRow => ({ name, rate: null, quantity: null, total: null });

    return {
      left: SITE_INFO_ITEMS.left.map(toRow),
      middle: SITE_INFO_ITEMS.middle.map(toRow),
      right: SITE_INFO_ITEMS.right.map(toRow)
    };
  }

  /** All 51 rows always print; the saved ones are merged in by name. */
  private mergeItems(items: SiteInfoItem[]) {
    const byName = new Map(items.map(item => [item.itemName, item]));

    this.sections.forEach(section => {
      this.itemsData[section].forEach(row => {
        const saved = byName.get(row.name);
        if (!saved) return;

        row.rate = saved.rate;
        row.quantity = saved.quantity;
        row.total = saved.total;
      });
    });
  }
}
