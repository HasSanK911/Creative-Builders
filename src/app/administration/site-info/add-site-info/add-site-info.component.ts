import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../Services/api.service';
import { Site } from '../../../models/site.model';
import { SiteInfo } from '../../../models/site-info.model';

@Component({
  selector: 'app-add-site-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-site-info.component.html',
  styleUrl: './add-site-info.component.css'
})
export class AddSiteInfoComponent implements OnInit {

  // Site Selection
  sites: Site[] = [];
  selectedSiteId: number | null = null;
  selectedSiteName: string = '';
  isDropdownOpen: boolean = false;

  // Form Fields
  blockNo: string = '';
  streetNo: string = '';
  houseNo: string = '';
  dateStarted: string = '';
  dateEnded: string = '';

  // UI State
  isUrdu: boolean = false;
  activeTab: 'items' | 'attendance' = 'items';
  isEditMode: boolean = false;
  siteInfoId: number | null = null;
  isSubmitting: boolean = false;

  // Constants
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

  translations: { [key: string]: string } = {
    'Item': 'آئٹم', 'Rate': 'ریٹ', 'Qty': 'مقدار', 'Total': 'کل',
    'Date': 'تاریخ', 'Payment': 'ادائیگی', "Engineer's Salary": 'انجینئر کی تنخواہ',
    'Bajri': 'بجری', 'Sand': 'ریت', 'Bricks': 'اینٹیں', 'Cement': 'سیمنٹ',
    'Cement -': 'سیمنٹ -', 'Cement +': 'سیمنٹ +', 'Steel': 'سٹیل',
    'Steel +': 'سٹیل +', 'Steel -': 'سٹیل -', 'A': 'ا', 'Bore Work': 'بور ورک',
    'Excavation Work': 'کھدائی کا کام', 'Backfilling Work': 'بیک فلنگ کا کام',
    'Gera': 'گیرا', 'Steel Wire': 'سٹیل تار', 'Basement Rooftop': 'بیسمنٹ چھت',
    'Shuttering Flat Film': 'شٹرنگ فلیٹ فلم', 'Shuttering (Ground Floor)': 'شٹرنگ (گراؤنڈ فلور)',
    'Shuttering (First Floor)': 'شٹرنگ (پہلی منزل)', 'Steel Work Labor': 'سٹیل ورک لیبر',
    'Chunai Labor': 'چنائی لیبر', 'Kacha Labor': 'کچا لیبر', 'Plaster': 'پلستر',
    'Aluminum': 'ایلومینیم', 'Cameras': 'کیمرے', 'Geaser': 'گیزر',
    'Electric Pipes': 'الیکٹرک پائپ', 'Electric Wire': 'الیکٹرک تار',
    'Electrician Amount': 'الیکٹریشن کی رقم', 'Electric Fitting': 'الیکٹرک فٹنگ',
    'Fans': 'پنکھے', 'Lights etc': 'لائٹس وغیرہ', 'Sanitary Pipes': 'سینیٹری پائپ',
    'Sanitory Labor': 'سینیٹری لیبر', 'Sanitory Materials': 'سینیٹری سامان',
    'Paint': 'پینٹ', 'Painter Amount': 'پینٹر کی رقم', 'Peeling': 'پیلنگ',
    'Graphing': 'گرافنگ', 'Ceiling': 'چھت', 'Stairs Marble': 'سیڑھیوں کا ماربل',
    'SS Reiling': 'ایس ایس ریلنگ', 'Wall Paper': 'وال پیپر', 'Marble': 'ماربل',
    'Marble Labor': 'ماربل لیبر', 'Tiles': 'ٹائلز', 'Tiles Labor': 'ٹائلز لیبر',
    'Door Lock': 'دروازے کا تالا', 'Chips': 'چپس', 'Chips Work': 'چپس ورک',
    'Bond': 'بانڈ', 'Tiff tile': 'ٹف ٹائل', 'Kitchen Hod': 'کچن ہوڈ',
    'Burner': 'برنر', 'Glass': 'شیشہ', 'Safety Grill': 'سیفٹی گرل',
    'Doors': 'دروازے', 'Cupboards': 'الماری', 'Lenter Machine': 'لینٹر مشین',
    'Cost': 'لاگت', 'Select Site': 'سائٹ منتخب کریں', 'Date Started': 'شروع کی تاریخ',
    'Date Ended': 'ختم ہونے کی تاریخ', 'Mukadam': 'مقدم', 'Owner Name': 'مالک کا نام',
    'Download PDF': 'پی ڈی ایف ڈاؤن لوڈ', 'Translate': 'ترجمہ', 'Upload Receipt': 'رسید اپ لوڈ',
    'Save Site Info': 'سائٹ کی معلومات محفوظ کریں', 'Uploaded Receipts': 'اپ لوڈ شدہ رسیدیں',
    'Add Site Information': 'سائٹ کی معلومات شامل کریں',
    'Block No.': 'بلاک نمبر', 'Street No.': 'گلی نمبر', 'House/Plaza No.': 'مکان/پلازہ نمبر',
    'Items Sheet': 'اشیاء کی شیٹ', 'Attendance Sheet': 'حاضری کی شیٹ'
  };

  // Data
  itemsData: any = this.getInitialItemsState();
  attendanceRows: any[] = this.getInitialAttendanceRows(12);
  receipts: string[] = [];
  activeReceiptIndex: number | null = null;

  constructor(
    private apiService: ApiService<any>,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSites();

    this.route.queryParams.subscribe(params => {
      if (params['siteId']) {
        this.selectedSiteId = +params['siteId'];
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.siteInfoId = +params['id'];
        this.loadSiteInfo(this.siteInfoId);
      }
    });
  }

  loadSites() {
    this.apiService.getAll('admin/my-sites').subscribe({
      next: (data: Site[]) => {
        this.sites = data;
        if (this.selectedSiteId && !this.isEditMode) {
          const site = this.sites.find(s => s.id === this.selectedSiteId);
          if (site) {
            this.selectedSiteName = site.name;
          }
        }
      },
      error: (err) => console.error('Error loading sites:', err)
    });
  }

  loadSiteInfo(id: number) {
    this.apiService.getById(`admin/site-info/${id}`).subscribe({
      next: (data: SiteInfo) => {
        this.selectedSiteId = data.site_id;
        this.selectedSiteName = data.site_name || '';
        this.dateStarted = data.date_started ? data.date_started.split('T')[0] : '';
        this.dateEnded = data.date_ended ? data.date_ended.split('T')[0] : '';
        this.blockNo = data.block_no || '';
        this.streetNo = data.street_no || '';
        this.houseNo = data.house_no || '';

        if (data.items_data) this.itemsData = data.items_data;
        if (data.attendance_data) this.attendanceRows = data.attendance_data;
        if (data.receipts) this.receipts = data.receipts;
      },
      error: (err) => {
        console.error('Error loading site info:', err);
        this.toastr.error('Failed to load site info.', 'Error');
      }
    });
  }

  saveSiteInfo() {
    if (!this.selectedSiteId) {
      this.toastr.warning('Please select a site.', 'Warning');
      return;
    }
    this.isSubmitting = true;

    const siteInfoData: SiteInfo = {
      site_id: this.selectedSiteId,
      block_no: this.blockNo,
      street_no: this.streetNo,
      house_no: this.houseNo,
      date_started: this.dateStarted,
      date_ended: this.dateEnded,
      items_data: this.itemsData,
      attendance_data: this.attendanceRows,
      receipts: this.receipts
    };

    if (this.isEditMode && this.siteInfoId) {
      this.apiService.update(`admin/site-info/${this.siteInfoId}`, siteInfoData).subscribe({
        next: () => {
          this.toastr.success('Site info updated successfully!', 'Success');
          this.isSubmitting = false;
          this.router.navigate(['/admin/site-info-table']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update site info.', 'Error');
          this.isSubmitting = false;
        }
      });
    } else {
      this.apiService.create('admin/site-info', siteInfoData).subscribe({
        next: () => {
          this.toastr.success('Site info created successfully!', 'Success');
          this.isSubmitting = false;
          this.router.navigate(['/admin/site-info-table']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to create site info.', 'Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  selectSite(site: Site) {
    this.selectedSiteId = site.id!;
    this.selectedSiteName = site.name;
    this.isDropdownOpen = false;
  }

  setActiveTab(tab: 'items' | 'attendance') {
    this.activeTab = tab;
  }

  t(key: string): string {
    return (this.isUrdu && this.translations[key]) ? this.translations[key] : key;
  }

  toggleTranslate() {
    this.isUrdu = !this.isUrdu;
  }

  downloadPDF() {
    window.print();
  }

  // Items Logic
  getInitialItemsState() {
    const leftItems = [
      'A', 'Bore Work', 'Excavation Work', 'Backfilling Work', 'Gera',
      'Steel Wire', 'Basement Rooftop', 'Shuttering Flat Film',
      'Shuttering (Ground Floor)', 'Shuttering (First Floor)',
      'Steel Work Labor', 'Chunai Labor', 'Kacha Labor',
      'Plaster', 'Aluminum', 'Cameras', 'Geaser'
    ];
    const middleItems = [
      'Electric Pipes', 'Electric Wire', 'Electrician Amount', 'Electric Fitting',
      'Fans', 'Lights etc', 'Sanitary Pipes', 'Sanitory Labor',
      'Sanitory Materials', 'Paint', 'Painter Amount', 'Peeling',
      'Graphing', 'Ceiling', 'Stairs Marble', 'SS Reiling', 'Wall Paper'
    ];
    const rightItems = [
      'Marble', 'Marble Labor', 'Tiles', 'Tiles Labor', 'Door Lock',
      'Chips', 'Chips Work', 'Bond', 'Tiff tile', 'Kitchen Hod',
      'Burner', 'Glass', 'Safety Grill', 'Doors', 'Cupboards',
      'Lenter Machine', 'Cost'
    ];
    const toRow = (name: string) => ({ name, rate: null, quantity: null, total: null });
    return {
      left: leftItems.map(toRow),
      middle: middleItems.map(toRow),
      right: rightItems.map(toRow)
    };
  }

  calculateTotal(item: any) {
    if (item.rate < 0) item.rate = 0;
    if (item.quantity < 0) item.quantity = 0;

    const rate = Number(item.rate) || 0;
    const qty = item.quantity === null || item.quantity === '' ? 1 : Number(item.quantity);

    // If rate is provided but qty is empty/null, total = rate * 1
    // If rate is 0 or empty, total is 0 regardless of qty
    item.total = rate ? rate * qty : null;
  }

  getSectionTotal(section: string): number {
    return this.itemsData[section].reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0);
  }

  // Attendance Logic
  getInitialAttendanceRows(count: number) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const row: any = { date: null };
      this.attendanceColumns.forEach(col => row[col] = null);
      rows.push(row);
    }
    return rows;
  }

  addAttendanceRow() {
    const row: any = { date: null };
    this.attendanceColumns.forEach(col => row[col] = null);
    this.attendanceRows.push(row);
  }

  getColumnTotal(col: string): number {
    return this.attendanceRows.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
  }

  getItemsGrandTotal(): number {
    const left = this.getSectionTotal('left');
    const middle = this.getSectionTotal('middle');
    const right = this.getSectionTotal('right');
    return left + middle + right;
  }

  getAttendanceGrandTotal(): number {
    const paymentColumns = [
      'engineerSalary', 'bajriPayment', 'sandPayment', 'bricksPayment',
      'cementPayment', 'steelPayment'
    ];
    let total = 0;
    for (const col of paymentColumns) {
      total += this.getColumnTotal(col);
    }
    return total;
  }

  // Receipt Logic
  onReceiptUpload(event: any) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.receipts.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = '';
  }

  deleteReceipt(index: number) {
    this.receipts.splice(index, 1);
    if (this.activeReceiptIndex === index) this.activeReceiptIndex = null;
  }

  viewReceipt(index: number) {
    this.activeReceiptIndex = index;
  }

  closeReceiptModal() {
    this.activeReceiptIndex = null;
  }

  downloadReceipt(index: number) {
    const link = document.createElement('a');
    link.href = this.receipts[index];
    link.download = `receipt-${index + 1}.png`;
    link.click();
  }
}
