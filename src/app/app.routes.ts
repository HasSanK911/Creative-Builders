import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path: '',
        loadChildren: () =>
            import('./customer-app/customer-app.module').then(m => m.CustomerAppModule)
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        loadChildren: () =>
            import('./administration/administration.module').then(m => m.AdministrationModule)
    },
];
