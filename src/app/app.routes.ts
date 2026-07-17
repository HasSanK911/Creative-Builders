import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './Services/auth.guard';

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
        canActivate: [authGuard],
        loadChildren: () =>
            import('./administration/administration.module').then(m => m.AdministrationModule)
    },
];
