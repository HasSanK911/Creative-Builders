import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServicesComponent } from './services/services.component';
import { GalleryComponent } from './gallery/gallery.component';
const routes: Routes = [
  {path:'' , component: LayoutComponent , children:[
    {path:'' , component: HomeComponent},
    {path:'contact-us' , component: ContactUsComponent},
    {path:'about-us' , component: AboutUsComponent},
    {path:'services' , component: ServicesComponent},
    {path:'gallery' , component: GalleryComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAppRoutingModule { }
