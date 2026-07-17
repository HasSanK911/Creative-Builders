import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PublicContentService } from '../../Services/public-content.service';
import { ImgSrcDirective } from '../../Services/img-src.directive';
import { initThemeScripts } from '../theme-init';
import { Faq, ServiceDetail } from '../../models/api.models';

/** A `detail1Title`/`detail1Description` pair, flattened for `*ngFor`. */
interface Section {
  title: string;
  description: string;
}

const DEFAULT_DETAILS: Section[] = [
  {
    title: 'Custom Building Plans',
    description: 'Every project is unique, which is why we offer fully tailored construction plans that align with your budget, timeline, and functional needs.',
  },
  {
    title: 'Modern Building Solutions',
    description: 'We use advanced construction technology and durable materials to ensure long-lasting strength, aesthetic appeal, and maximum efficiency.',
  },
  {
    title: 'Flexible Budgeting Options',
    description: 'We make construction investments easier with transparent budget planning, cost-saving strategies, and quality assurance processes.',
  },
];

const DEFAULT_BENEFITS: Section[] = [
  { title: 'Reliable Project Delivery', description: 'We ensure timely delivery with strict quality control, ensuring your construction project meets all expectations.' },
  { title: 'Expert Engineering', description: 'Our engineers bring years of experience in structural planning, durability studies, and modern construction techniques.' },
  { title: 'Skilled Workforce', description: 'Our dedicated team ensures precision workmanship with a strong focus on safety and industry standards.' },
  { title: 'Professional Services', description: 'From planning to project completion, we provide end-to-end solutions with transparent communication.' },
  { title: 'Smart Budget Planning', description: 'We help you maximize value with cost-effective solutions, smart material choices, and optimized project planning.' },
  { title: 'Industry Expertise', description: 'With years of experience, we guarantee high-performance designs, durable structures, and outstanding results.' },
];

const DEFAULT_FAQS: Faq[] = [
  {
    question: 'What is included in a construction project?',
    answer: 'Our construction process includes planning, design, material selection, site preparation, structural building, quality inspection, and final project handover with safety compliance.',
  },
  {
    question: 'How long does it take to complete a project?',
    answer: 'Project duration depends on design complexity, materials, manpower, and weather conditions. We always provide a clear timeline after evaluating your project in detail.',
  },
  {
    question: 'Do I need permits for my construction project?',
    answer: 'Yes, most construction projects require government approvals and permits. Our team assists you throughout the application and documentation process.',
  },
  {
    question: 'Is maintenance required after project completion?',
    answer: 'Yes, proper maintenance ensures safety and longevity. We offer annual check-ups, repair services, and professional guidance for long-term durability.',
  },
];

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ImgSrcDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  detail: ServiceDetail | null = null;
  faqs: Faq[] = [];

  constructor(private router: Router, private content: PublicContentService) { }

  ngOnInit(): void {
    forkJoin({
      detail: this.content.serviceDetail(),
      faqs: this.content.faqs(),
    }).subscribe(data => {
      this.detail = data.detail;
      this.faqs = data.faqs.length ? data.faqs : DEFAULT_FAQS;

      initThemeScripts();
    });
  }

  /**
   * The three "detail" cards live in flat `detail1Title`…`detail3Title` columns, and the
   * six benefit cards in `benefit1Title`…`benefit6Title`. Both are collapsed into lists
   * here so the template can simply repeat over them: blank slots drop out, and if the
   * admin has filled in none, the copy the theme shipped with stands in.
   */
  details(): Section[] {
    const d = this.detail;

    return this.compact([
      { title: d?.detail1Title, description: d?.detail1Description },
      { title: d?.detail2Title, description: d?.detail2Description },
      { title: d?.detail3Title, description: d?.detail3Description },
    ], DEFAULT_DETAILS);
  }

  benefits(): Section[] {
    const d = this.detail;

    return this.compact([
      { title: d?.benefit1Title, description: d?.benefit1Description },
      { title: d?.benefit2Title, description: d?.benefit2Description },
      { title: d?.benefit3Title, description: d?.benefit3Description },
      { title: d?.benefit4Title, description: d?.benefit4Description },
      { title: d?.benefit5Title, description: d?.benefit5Description },
      { title: d?.benefit6Title, description: d?.benefit6Description },
    ], DEFAULT_BENEFITS);
  }

  /** The theme's benefit icons — the API carries no icon for these cards. */
  benefitIcon(index: number): string {
    const icons = ['assets/images/service/13.svg', 'assets/images/service/14.svg', 'assets/images/service/15.svg'];

    return icons[index % icons.length];
  }

  gotoContactUs() {
    this.router.navigate(['/contact-us']);
  }

  private compact(slots: { title?: string | null; description?: string | null }[], fallback: Section[]): Section[] {
    const filled = slots
      .filter(slot => !!slot.title?.trim())
      .map(slot => ({ title: slot.title as string, description: slot.description ?? '' }));

    return filled.length ? filled : fallback;
  }
}
