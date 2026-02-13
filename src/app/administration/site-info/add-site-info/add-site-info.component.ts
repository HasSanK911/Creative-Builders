import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-site-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-site-info.component.html',
  styleUrl: './add-site-info.component.css'
})
export class AddSiteInfoComponent {

  selectedSite: string = '';
  sites: string[] = ['Rizwan Heights', 'Ali\'s Home', 'Lodhi\'s Arcade'];
  isDropdownOpen: boolean = false;
  isUrdu: boolean = false;
  dateStarted: string = '';
  dateEnded: string = '';

  // --- Translation ---
  translations: { [key: string]: string } = {
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
  };

  t(key: string): string {
    if (this.isUrdu && this.translations[key]) {
      return this.translations[key];
    }
    return key;
  }

  selectSite(site: string) {
    this.selectedSite = site;
    this.isDropdownOpen = false;
  }

  itemsData: any = this.getInitialItemsState();

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
    const rate = Number(item.rate) || 0;
    const qty = Number(item.quantity) || 0;
    item.total = rate && qty ? rate * qty : null;
  }

  getSectionTotal(section: string): number {
    return this.itemsData[section].reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0);
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

  attendanceRows: any[] = this.getInitialAttendanceRows(12);

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

  // --- Action Buttons ---
  receipts: string[] = [];

  downloadPDF() {
    window.print();
  }

  toggleTranslate() {
    this.isUrdu = !this.isUrdu;
  }

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
    if (this.activeReceiptIndex === index) {
      this.activeReceiptIndex = null;
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
    link.href = this.receipts[index];
    link.download = `receipt-${index + 1}.png`;
    link.click();
  }

}
