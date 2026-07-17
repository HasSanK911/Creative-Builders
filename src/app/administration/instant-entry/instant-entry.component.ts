import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { InstantEntryPayload, ItemSection, Site, SiteInfoItem, SITE_INFO_ITEMS } from '../../models/api.models';

interface EntryItem {
  name: string;
  section: ItemSection;
}

/** A row staged in the local table. `siteName` is for display; `siteId` is what gets sent. */
interface InstantEntry {
  siteId: number;
  siteName: string;
  item: string;
  section: ItemSection;
  rate: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-instant-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instant-entry.component.html',
  styleUrl: './instant-entry.component.css'
})
export class InstantEntryComponent implements OnInit {

  sites: Site[] = [];

  // The same 51 line items as the site-info sheet, flattened out of the shared catalogue.
  // `section` is shown as a hint in the picker only — the server derives it from the name.
  items: EntryItem[] = (Object.keys(SITE_INFO_ITEMS) as ItemSection[]).flatMap(
    section => SITE_INFO_ITEMS[section].map(name => ({ name, section }))
  );

  selectedSite: Site | null = null;
  selectedItem: EntryItem | null = null;
  rate: number | null = null;
  quantity: number | null = null;

  isSiteDropdownOpen: boolean = false;
  isItemDropdownOpen: boolean = false;
  itemSearch: string = '';

  entries: InstantEntry[] = [];

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService<SiteInfoItem>, private siteApi: ApiService<Site>) { }

  ngOnInit() {
    this.loading = true;

    this.siteApi.getAll('sites').subscribe({
      next: sites => {
        this.sites = sites;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  get filteredItems(): EntryItem[] {
    const query = this.itemSearch.trim().toLowerCase();
    if (!query) {
      return this.items;
    }
    return this.items.filter(item => item.name.toLowerCase().includes(query));
  }

  get total(): number | null {
    const rate = Number(this.rate) || 0;
    const qty = Number(this.quantity) || 0;
    return rate && qty ? rate * qty : null;
  }

  selectSite(site: Site) {
    this.selectedSite = site;
    this.isSiteDropdownOpen = false;
  }

  selectItem(item: EntryItem) {
    this.selectedItem = item;
    this.isItemDropdownOpen = false;
    this.itemSearch = '';
  }

  addEntry() {
    const site = this.selectedSite;
    const item = this.selectedItem;

    if (!site?.id || !item || !this.rate || !this.quantity) {
      alert('Please select a site and an item, then enter a rate and quantity.');
      return;
    }

    this.success = null;

    this.entries.push({
      siteId: site.id,
      siteName: site.name,
      item: item.name,
      section: item.section,
      rate: Number(this.rate),
      quantity: Number(this.quantity),
      total: Number(this.rate) * Number(this.quantity)
    });

    this.resetEntryFields();
  }

  removeEntry(index: number) {
    this.entries.splice(index, 1);
  }

  getEntriesTotal(): number {
    return this.entries.reduce((sum, entry) => sum + entry.total, 0);
  }

  saveEntries() {
    if (!this.entries.length) {
      alert('Add at least one entry before saving.');
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    // The endpoint wraps the array in an object, and derives `section` / `total` itself.
    const payload: { entries: InstantEntryPayload[] } = {
      entries: this.entries.map(entry => ({
        siteId: entry.siteId,
        itemName: entry.item,
        rate: entry.rate,
        quantity: entry.quantity
      }))
    };

    const count = this.entries.length;

    this.api.create('instant-entries', payload).subscribe({
      next: () => {
        this.entries = [];
        this.saving = false;
        this.success = `${count} entry(s) saved to the site's item sheet.`;
      },
      error: err => {
        this.error = err.message;
        this.saving = false;
      }
    });
  }

  // The site stays selected so several items can be punched in for one site.
  private resetEntryFields() {
    this.selectedItem = null;
    this.rate = null;
    this.quantity = null;
    this.itemSearch = '';
  }
}
