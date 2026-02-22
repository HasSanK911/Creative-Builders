import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';
import { SiteInfo } from '../../../models/site-info.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-site-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-site-info.component.html',
  styleUrl: './view-site-info.component.css'
})
export class ViewSiteInfoComponent implements OnInit {

  siteInfo: SiteInfo | null = null;
  activeTab: 'items' | 'attendance' = 'items';
  isUrdu: boolean = false;

  // Data
  itemsData: any = { left: [], middle: [], right: [] };
  attendanceRows: any[] = [];
  receipts: string[] = [];
  activeReceiptIndex: number | null = null;

  attendanceHeaders: string[] = [
    'Date', "Engineer's Salary",
    'Bajri', 'Sainkray', 'Trolley', 'Payment',
    'Rait', 'Sainkray', 'Trolley', 'Payment',
    'Bricks', 'Payment',
    'Cement', 'Payment', 'Cement -', 'Cement +',
    'Steel Size', 'Steel', 'Payment', 'Steel +', 'Steel -'
  ];

  attendanceColumns = [
    'engineerSalary',
    'bajriSainkray', 'bajriTrolley', 'bajriPayment',
    'raitSainkray', 'raitTrolley', 'sandPayment',
    'bricks', 'bricksPayment',
    'cement', 'cementPayment', 'cementMinus', 'cementPlus',
    'steelSize', 'steel', 'steelPayment', 'steelPlus', 'steelMinus'
  ];

  translations: { [key: string]: string } = {
    'Item': 'آئٹم', 'Rate': 'ریٹ', 'Qty': 'مقدار', 'Total': 'کل',
    'Date': 'تاریخ', 'Payment': 'ادائیگی', "Engineer's Salary": 'انجینئر کی تنخواہ',
    'Bajri': 'بجری', 'Rait': 'ریت', 'Sand': 'ریت', 'Bricks': 'اینٹیں', 'Cement': 'سیمنٹ',
    'Cement -': 'سیمنٹ -', 'Cement +': 'سیمنٹ +', 'Steel': 'سٹیل',
    'Steel +': 'سٹیل +', 'Steel -': 'سٹیل -', 'Sainkray': 'سینکرے', 'Trolley': 'ٹرالی',
    'Steel Size': 'سٹیل سائز', 'Project Duration': 'منصوبے کا دورانیہ',
    'Bags': 'بیگ', 'Pieces': 'پیسے', 'Tons': 'ٹن',
    'Days': 'دن', 'Months': 'مہینے', 'Ongoing': 'جاری', 'Completed': 'مکمل', 'Days Left': 'دن باقی',
    'A': 'ا', 'Bore Work': 'بور ورک',
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
    'Items Sheet': 'اشیاء کی شیٹ', 'Attendance Sheet': 'حاضری کی شیٹ',
    'Site Information': 'سائٹ کی معلومات', 'Back': 'واپس'
  };

  constructor(
    private apiService: ApiService<any>,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadSiteInfo(+params['id']);
      }
    });
  }

  loadSiteInfo(id: number) {
    this.apiService.getById(`admin/site-info/${id}`).subscribe({
      next: (data: SiteInfo) => {
        this.siteInfo = data;
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

  getSectionTotal(section: string): number {
    return this.itemsData[section]?.reduce((sum: number, item: any) => {
      if (item.name === 'A') return sum;
      return sum + (Number(item.total) || 0);
    }, 0) || 0;
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

  getProjectDuration(): { days: number; months: number; status: string; daysLeft: number | null } {
    if (!this.siteInfo?.date_started) return { days: 0, months: 0, status: 'Not Started', daysLeft: null };
    const start = new Date(this.siteInfo.date_started);
    const today = new Date();
    const elapsed = Math.max(0, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    if (this.siteInfo.date_ended) {
      const end = new Date(this.siteInfo.date_ended);
      if (today >= end) {
        const totalDays = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        return { days: totalDays, months: Math.floor(totalDays / 30), status: 'Completed', daysLeft: 0 };
      } else {
        const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return { days: elapsed, months: Math.floor(elapsed / 30), status: 'Ongoing', daysLeft };
      }
    } else {
      return { days: elapsed, months: Math.floor(elapsed / 30), status: 'Ongoing', daysLeft: null };
    }
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
