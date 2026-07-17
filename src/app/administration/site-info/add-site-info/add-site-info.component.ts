import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import {
  ItemSection,
  Site,
  SiteInfo,
  SiteInfoAttendance,
  SiteInfoItem,
  SiteStatus,
  SITE_INFO_ITEMS
} from '../../../models/api.models';

/** One cell of the 3 x 17 print layout. `total` is display-only — the server recomputes it. */
interface ItemRow {
  name: string;
  rate: number | null;
  quantity: number | null;
  total: number | null;
}

/**
 * A receipt in the gallery: either already stored (has `path`, `url` is the absolute URL the
 * API handed out) or staged in this session (has `file`, `url` is a local object URL).
 */
interface ReceiptView {
  url: string;
  path?: string;
  file?: File;
}

/** The write shape: `receipts` goes out as paths, and items carry no `total`/`section`. */
type SiteInfoPayload = Omit<SiteInfo, 'id' | 'siteName' | 'items' | 'receipts'> & {
  items: Pick<SiteInfoItem, 'itemName' | 'rate' | 'quantity'>[];
  receipts: string[];
};

@Component({
  selector: 'app-add-site-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-site-info.component.html',
  styleUrl: './add-site-info.component.css'
})
export class AddSiteInfoComponent implements OnInit, OnDestroy {

  /** Set from `?id=` — present means we are editing an existing sheet. */
  siteInfoId: number | null = null;

  sites: Site[] = [];
  selectedSiteId: number | null = null;
  isDropdownOpen: boolean = false;
  isUrdu: boolean = false;

  dateStarted: string = '';
  dateEnded: string = '';
  blockNo: string = '';
  streetNo: string = '';
  houseNo: string = '';
  mukadam: string = '';
  ownerName: string = '';
  status: SiteStatus = 'Pending';
  statusOptions: SiteStatus[] = ['Pending', 'Completed', 'Dispute'];
  isStatusDropdownOpen: boolean = false;

  activeTab: string = 'item-sheet';

  loading = false;
  saving = false;
  error: string | null = null;

  private readonly sections: ItemSection[] = ['left', 'middle', 'right'];

  constructor(
    private api: ApiService<SiteInfo>,
    private siteApi: ApiService<Site>,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadSites();

    const id = this.route.snapshot.queryParamMap.get('id');
    if (!id) return;

    this.siteInfoId = Number(id);
    this.loading = true;

    // Only the single-sheet endpoint eager-loads items / attendance / receipts.
    this.api.getById(`site-infos/${this.siteInfoId}`).subscribe({
      next: sheet => {
        this.prefill(sheet);
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.receipts.forEach(receipt => this.revokePreview(receipt));
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  private loadSites() {
    this.siteApi.getAll('sites').subscribe({
      next: sites => this.sites = sites,
      error: err => this.error = err.message
    });
  }

  // --- Translation ---
  translations: { [key: string]: string } = {
    'Item Sheet': 'آئٹم شیٹ',
    'Attendance Sheet': 'اٹینڈنس شیٹ',
    'Item': 'آئٹم',
    'Rate': 'ریٹ',
    'Qty': 'مقدار',
    'Total': 'کل',
    'Date': 'تاریخ',
    'Payment': 'ادائیگی',
    "Engineer's Salary": 'انجینئر کی تنخواہ',
    'Bajri': 'بجری',
    'Sand': 'ریت',
    'Bricks': 'اینٹیں',
    'Cement': 'سیمنٹ',
    'Cement -': 'سیمنٹ -',
    'Cement +': 'سیمنٹ +',
    'Steel': 'سٹیل',
    'Steel +': 'سٹیل +',
    'Steel -': 'سٹیل -',
    'A': 'ا',
    'Bore Work': 'بور ورک',
    'Excavation Work': 'کھدائی کا کام',
    'Backfilling Work': 'بیک فلنگ کا کام',
    'Gera': 'گیرا',
    'Steel Wire': 'سٹیل تار',
    'Basement Rooftop': 'بیسمنٹ چھت',
    'Shuttering Flat Film': 'شٹرنگ فلیٹ فلم',
    'Shuttering (Ground Floor)': 'شٹرنگ (گراؤنڈ فلور)',
    'Shuttering (First Floor)': 'شٹرنگ (پہلی منزل)',
    'Steel Work Labor': 'سٹیل ورک لیبر',
    'Chunai Labor': 'چنائی لیبر',
    'Kacha Labor': 'کچا لیبر',
    'Plaster': 'پلستر',
    'Aluminum': 'ایلومینیم',
    'Cameras': 'کیمرے',
    'Geaser': 'گیزر',
    'Electric Pipes': 'الیکٹرک پائپ',
    'Electric Wire': 'الیکٹرک تار',
    'Electrician Amount': 'الیکٹریشن کی رقم',
    'Electric Fitting': 'الیکٹرک فٹنگ',
    'Fans': 'پنکھے',
    'Lights etc': 'لائٹس وغیرہ',
    'Sanitary Pipes': 'سینیٹری پائپ',
    'Sanitory Labor': 'سینیٹری لیبر',
    'Sanitory Materials': 'سینیٹری سامان',
    'Paint': 'پینٹ',
    'Painter Amount': 'پینٹر کی رقم',
    'Peeling': 'پیلنگ',
    'Graphing': 'گرافنگ',
    'Ceiling': 'چھت',
    'Stairs Marble': 'سیڑھیوں کا ماربل',
    'SS Reiling': 'ایس ایس ریلنگ',
    'Wall Paper': 'وال پیپر',
    'Marble': 'ماربل',
    'Marble Labor': 'ماربل لیبر',
    'Tiles': 'ٹائلز',
    'Tiles Labor': 'ٹائلز لیبر',
    'Door Lock': 'دروازے کا تالا',
    'Chips': 'چپس',
    'Chips Work': 'چپس ورک',
    'Bond': 'بانڈ',
    'Tiff tile': 'ٹف ٹائل',
    'Kitchen Hod': 'کچن ہوڈ',
    'Burner': 'برنر',
    'Glass': 'شیشہ',
    'Safety Grill': 'سیفٹی گرل',
    'Doors': 'دروازے',
    'Cupboards': 'الماری',
    'Lenter Machine': 'لینٹر مشین',
    'Cost': 'لاگت',
    'Select Site': 'سائٹ منتخب کریں',
    'Date Started': 'شروع کی تاریخ',
    'Date Ended': 'ختم ہونے کی تاریخ',
    'Mukadam': 'مقدم',
    'Owner Name': 'مالک کا نام',
    'Download PDF': 'پی ڈی ایف ڈاؤن لوڈ',
    'Translate': 'ترجمہ',
    'Upload Receipt': 'رسید اپ لوڈ',
    'Save Site Info': 'سائٹ کی معلومات محفوظ کریں',
    'Uploaded Receipts': 'اپ لوڈ شدہ رسیدیں',
    'Add Site Information': 'سائٹ کی معلومات شامل کریں',
    'Block No.': 'بلاک نمبر',
    'Street No.': 'گلی نمبر',
    'House/Plaza No.': 'مکان/پلازہ نمبر',
    'Status': 'حالت',
    'Pending': 'زیر التوا',
    'Completed': 'مکمل',
    'Dispute': 'تنازع',
  };

  t(key: string): string {
    if (this.isUrdu && this.translations[key]) {
      return this.translations[key];
    }
    return key;
  }

  selectSite(site: Site) {
    this.selectedSiteId = site.id ?? null;
    this.isDropdownOpen = false;
  }

  get selectedSiteName(): string {
    return this.sites.find(site => site.id === this.selectedSiteId)?.name ?? '';
  }

  selectStatus(status: SiteStatus) {
    this.status = status;
    this.isStatusDropdownOpen = false;
  }

  itemsData: Record<ItemSection, ItemRow[]> = this.getInitialItemsState();

  getInitialItemsState(): Record<ItemSection, ItemRow[]> {
    const toRow = (name: string): ItemRow => ({ name, rate: null, quantity: null, total: null });

    return {
      left: SITE_INFO_ITEMS.left.map(toRow),
      middle: SITE_INFO_ITEMS.middle.map(toRow),
      right: SITE_INFO_ITEMS.right.map(toRow)
    };
  }

  calculateTotal(item: ItemRow) {
    const rate = Number(item.rate) || 0;
    const qty = Number(item.quantity) || 0;
    item.total = rate && qty ? rate * qty : null;
  }

  getSectionTotal(section: ItemSection): number {
    return this.itemsData[section].reduce((sum: number, item: ItemRow) => sum + (Number(item.total) || 0), 0);
  }

  // --- Attendance / Daily Entry Table ---
  attendanceHeaders: string[] = [
    'Date', "Engineer's Salary", 'Bajri', 'Payment', 'Sand', 'Payment',
    'Bricks', 'Payment', 'Cement', 'Payment', 'Cement -', 'Cement +',
    'Steel', 'Payment', 'Steel +', 'Steel -'
  ];

  attendanceColumns = [
    'engineerSalary', 'bajri', 'bajriPayment', 'sand', 'sandPayment',
    'bricks', 'bricksPayment', 'cement', 'cementPayment',
    'cementMinus', 'cementPlus', 'steel', 'steelPayment',
    'steelPlus', 'steelMinus'
  ];

  attendanceRows: SiteInfoAttendance[] = this.getInitialAttendanceRows(12);

  getInitialAttendanceRows(count: number): SiteInfoAttendance[] {
    const rows: SiteInfoAttendance[] = [];
    for (let i = 0; i < count; i++) {
      const row: any = { date: null };
      this.attendanceColumns.forEach(col => row[col] = null);
      rows.push(row as SiteInfoAttendance);
    }
    return rows;
  }

  addAttendanceRow() {
    this.attendanceRows.push(this.getInitialAttendanceRows(1)[0]);
  }

  getColumnTotal(col: string): number {
    return this.attendanceRows.reduce((sum, row) => sum + (Number((row as any)[col]) || 0), 0);
  }

  // --- Action Buttons ---
  receipts: ReceiptView[] = [];

  downloadPDF() {
    window.print();
  }

  toggleTranslate() {
    this.isUrdu = !this.isUrdu;
  }

  onReceiptUpload(event: any) {
    const files = event.target.files;
    if (files) {
      // Previewed locally; the files only leave the browser when the sheet is saved.
      for (const file of Array.from(files) as File[]) {
        this.receipts.push({ url: URL.createObjectURL(file), file });
      }
    }
    event.target.value = '';
  }

  deleteReceipt(index: number) {
    const [removed] = this.receipts.splice(index, 1);
    this.revokePreview(removed);

    if (this.activeReceiptIndex === null) return;

    // The modal reads receipts[activeReceiptIndex], so the index has to follow the splice.
    if (this.activeReceiptIndex === index) {
      this.activeReceiptIndex = null;
    } else if (this.activeReceiptIndex > index) {
      this.activeReceiptIndex--;
    }
  }

  activeReceiptIndex: number | null = null;

  viewReceipt(index: number) {
    this.activeReceiptIndex = index;
  }

  closeReceiptModal() {
    this.activeReceiptIndex = null;
  }

  downloadReceipt(index: number) {
    const link = document.createElement('a');
    link.href = this.receipts[index].url;
    link.download = `receipt-${index + 1}.png`;
    // A stored receipt is cross-origin, which makes the browser ignore `download` — open it instead.
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
  }

  // --- Save ---
  saveSiteInfo() {
    if (!this.selectedSiteId) {
      this.error = 'Please select a site before saving.';
      return;
    }

    this.saving = true;
    this.error = null;

    const staged = this.receipts.filter(receipt => receipt.file).map(receipt => receipt.file as File);
    if (!staged.length) {
      this.persist(this.storedReceiptPaths());
      return;
    }

    this.api.uploadMany(staged).subscribe({
      next: uploaded => this.persist([...this.storedReceiptPaths(), ...uploaded.map(file => file.path)]),
      error: err => this.fail(err)
    });
  }

  /** A PUT replaces the whole receipt set, so the ones already stored have to be re-sent. */
  private storedReceiptPaths(): string[] {
    return this.receipts.filter(receipt => receipt.path).map(receipt => receipt.path as string);
  }

  private persist(receipts: string[]) {
    const payload: SiteInfoPayload = {
      siteId: this.selectedSiteId,
      dateStarted: this.dateStarted || null,
      dateEnded: this.dateEnded || null,
      blockNo: this.blockNo || null,
      streetNo: this.streetNo || null,
      houseNo: this.houseNo || null,
      status: this.status,
      mukadam: this.mukadam || null,
      ownerName: this.ownerName || null,
      // Matched by name server-side, which also derives the section and computes the total.
      items: this.sections.flatMap(section => this.itemsData[section]).map(item => ({
        itemName: item.name,
        rate: this.toNumber(item.rate),
        quantity: this.toNumber(item.quantity)
      })),
      // Entirely blank rows are dropped server-side, so the empty starter rows can go as they are.
      attendance: this.attendanceRows.map(row => this.toAttendancePayload(row)),
      receipts
    };

    const save = this.siteInfoId
      ? this.api.update(`site-infos/${this.siteInfoId}`, payload)
      : this.api.create('site-infos', payload);

    save.subscribe({
      next: () => this.router.navigate(['../site-info-table'], { relativeTo: this.route }),
      error: err => this.fail(err)
    });
  }

  private fail(err: Error) {
    this.error = err.message;
    this.saving = false;
  }

  // --- Loading an existing sheet ---
  private prefill(sheet: SiteInfo) {
    this.selectedSiteId = sheet.siteId;
    this.dateStarted = this.toDateInput(sheet.dateStarted);
    this.dateEnded = this.toDateInput(sheet.dateEnded);
    this.blockNo = sheet.blockNo ?? '';
    this.streetNo = sheet.streetNo ?? '';
    this.houseNo = sheet.houseNo ?? '';
    this.status = sheet.status ?? 'Pending';
    this.mukadam = sheet.mukadam ?? '';
    this.ownerName = sheet.ownerName ?? '';

    this.mergeItems(sheet.items ?? []);
    this.mergeAttendance(sheet.attendance ?? []);
    this.receipts = (sheet.receipts ?? []).map(receipt => ({ url: receipt.url, path: receipt.filePath }));
  }

  /** The sheet always renders all 51 rows; the saved ones are merged in by name. */
  private mergeItems(items: SiteInfoItem[]) {
    const byName = new Map(items.map(item => [item.itemName, item]));

    this.sections.forEach(section => {
      this.itemsData[section].forEach(row => {
        const saved = byName.get(row.name);
        if (!saved) return;

        row.rate = saved.rate;
        row.quantity = saved.quantity;
        this.calculateTotal(row);
      });
    });
  }

  private mergeAttendance(attendance: SiteInfoAttendance[]) {
    const saved = attendance.map(row => {
      const next: any = { date: this.toDateInput(row.date) || null };
      this.attendanceColumns.forEach(col => next[col] = (row as any)[col] ?? null);
      return next as SiteInfoAttendance;
    });

    // Pad back out to 12 so a sparse sheet still looks like the printed form.
    const padding = Math.max(0, 12 - saved.length);
    this.attendanceRows = [...saved, ...this.getInitialAttendanceRows(padding)];
  }

  private toAttendancePayload(row: SiteInfoAttendance): SiteInfoAttendance {
    const payload: any = { date: row.date || null };
    this.attendanceColumns.forEach(col => payload[col] = this.toNumber((row as any)[col]));
    return payload as SiteInfoAttendance;
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  }

  /** `<input type="date">` only accepts YYYY-MM-DD — trim anything the API appends. */
  private toDateInput(value: string | null): string {
    return value ? String(value).slice(0, 10) : '';
  }

  private revokePreview(receipt: ReceiptView | undefined) {
    if (receipt?.file) {
      URL.revokeObjectURL(receipt.url);
    }
  }
}
