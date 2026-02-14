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
    return this.itemsData[section]?.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0) || 0;
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
