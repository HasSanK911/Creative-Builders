import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './banner-table.component.html',
  styleUrls: ['./banner-table.component.css']
})
export class BannerTableComponent {
  banners = [
    {
      id: 1,
      image: 'assets/images/banner/banner-1.jpg',
      tagline: 'Building Opportunities Creating Value',
      heading: 'Your Trusted Partner in Construction',
      description: 'Quality construction delivers stronger, safer structures with lasting durability. Modern methods cut waste and boost efficiency, creating better homes and a more sustainable environment.',
      buttonText: 'Get Started'
    },
    {
      id: 2,
      image: 'assets/images/banner/banner-2.jpg',
      tagline: 'Excellence in Every Project',
      heading: 'Building Dreams into Reality',
      description: 'We bring innovation and expertise to every construction project, ensuring high-quality results that exceed expectations and stand the test of time.',
      buttonText: 'Learn More'
    },
    {
      id: 3,
      image: 'assets/images/banner/banner-3.jpg',
      tagline: 'Professional Construction Services',
      heading: 'Quality You Can Trust',
      description: 'With years of experience and a commitment to excellence, we deliver construction solutions that combine craftsmanship with modern technology.',
      buttonText: 'Contact Us'
    }
  ];

  deleteBanner(id: number) {
    // Placeholder for delete functionality
    if (confirm('Are you sure you want to delete this banner?')) {
      this.banners = this.banners.filter(banner => banner.id !== id);
      console.log('Banner deleted:', id);
    }
  }

  editBanner(id: number) {
    // Placeholder for edit functionality
    console.log('Edit banner:', id);
  }
}
