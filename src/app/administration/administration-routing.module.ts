import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { BannerTableComponent } from './banner/banner-table/banner-table.component';
import { AddAboutCompanyDetailsComponent } from './about-company/add-about-company-details/add-about-company-details.component';
import { AddFaqComponent } from './faq/add-faq/add-faq.component';
import { FaqTableComponent } from './faq/faq-table/faq-table.component';
import { GalleryTableComponent } from './gallery/gallery-table/gallery-table.component';
import { AddGalleryItemComponent } from './gallery/add-gallery-item/add-gallery-item.component';
import { ViewMaterialsDetailsComponent } from './materials/view-materials-details/view-materials-details.component';
import { MaterialsTableComponent } from './materials/materials-table/materials-table.component';
import { AddSiteComponent } from './my-sites/add-site/add-site.component';
import { SitesTableComponent } from './my-sites/sites-table/sites-table.component';
import { OurTeamTableComponent } from './our-team/our-team-table/our-team-table.component';
import { AddTeamMemberComponent } from './our-team/add-team-member/add-team-member.component';
import { AddServiceComponent } from './services/add-service/add-service.component';
import { ServicesTableComponent } from './services/services-table/services-table.component';
import { AddServicesDetailComponent } from './services/add-services-detail/add-services-detail.component';
import { SiteInfoTableComponent } from './site-info/site-info-table/site-info-table.component';
import { ViewSiteInfoComponent } from './site-info/view-site-info/view-site-info.component';
import { AddSiteInfoComponent } from './site-info/add-site-info/add-site-info.component';
import { AddTestimonialsComponent } from './testimonials/add-testimonials/add-testimonials.component';
import { TestimonialsTableComponent } from './testimonials/testimonials-table/testimonials-table.component';
import { AddWhyChooseUsComponent } from './why-choose-us/add-why-choose-us/add-why-choose-us.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-banner', component: AddBannerComponent },
      { path: 'banner-list', component: BannerTableComponent },
      { path: 'company-details', component: AddAboutCompanyDetailsComponent },
      { path: 'add-faq', component: AddFaqComponent },
      { path: 'faq-list', component: FaqTableComponent },
      { path: 'add-gallery-item', component: AddGalleryItemComponent },
      { path: 'gallery-item-list', component: GalleryTableComponent },
      { path: 'view-material-detials', component: ViewMaterialsDetailsComponent },
      { path: 'materials-list', component: MaterialsTableComponent },
      { path: 'add-site', component: AddSiteComponent },
      { path: 'site-list', component: SitesTableComponent },
      { path: 'add-team-member', component: AddTeamMemberComponent },
      { path: 'team-member-list', component: OurTeamTableComponent },
      { path: 'add-service', component: AddServiceComponent },
      { path: 'service-list', component: ServicesTableComponent },
      { path: 'site-info-table', component: SiteInfoTableComponent },
      { path: 'view-site-info', component: ViewSiteInfoComponent },
      { path: 'add-site-info', component: AddSiteInfoComponent },
      { path: 'add-testimonials', component: AddTestimonialsComponent },
      { path: 'testimonials-list', component: TestimonialsTableComponent },
      { path: 'why-choose-us', component: AddWhyChooseUsComponent },
      { path: 'contact-details', component: ContactDetailsComponent },
      { path: 'profile-settings', component: ProfileSettingsComponent },
      { path: 'add-service-detail', component: AddServicesDetailComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
