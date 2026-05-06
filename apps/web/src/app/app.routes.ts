import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { HomePageComponent } from './features/public/home-page.component';
import { CarListPageComponent } from './features/public/car-list-page.component';
import { CarDetailPageComponent } from './features/public/car-detail-page.component';
import { ComparePageComponent } from './features/public/compare-page.component';
import { ContactPageComponent } from './features/public/contact-page.component';
import { DealerProfilePageComponent } from './features/public/dealer-profile-page.component';
import { DealerDashboardComponent } from './features/dealer/dealer-dashboard.component';
import { SuperAdminDashboardComponent } from './features/admin/super-admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Lao Auto - Cars in Laos' },
  { path: 'cars', component: CarListPageComponent, title: 'Browse cars' },
  { path: 'cars/:id', component: CarDetailPageComponent, title: 'Car details' },
  { path: 'contact', component: ContactPageComponent, title: 'Contact LAOS AUTO' },
  { path: 'compare', component: ComparePageComponent, title: 'Compare cars' },
  { path: 'dealers/:slug', component: DealerProfilePageComponent, title: 'Dealer profile' },
  { path: 'cpanel/dealer', component: DealerDashboardComponent, title: 'Dealer Cpanel' },
  { path: 'cpanel/admin', component: SuperAdminDashboardComponent, title: 'Admin Cpanel' },
  { path: 'dashboard', component: DealerDashboardComponent, canActivate: [authGuard], title: 'Dealer dashboard' },
  { path: 'admin', component: SuperAdminDashboardComponent, canActivate: [authGuard], title: 'Platform admin' },
  { path: '**', redirectTo: '' }
];
