import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  CalendarCheck,
  Eye,
  Gauge,
  LucideAngularModule,
  Menu,
  MessageCircle,
  Phone,
  Scale,
  Search,
  SlidersHorizontal,
  Star,
  UserRound
} from 'lucide-angular';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        CalendarCheck,
        Eye,
        Gauge,
        Menu,
        MessageCircle,
        Phone,
        Scale,
        Search,
        SlidersHorizontal,
        Star,
        UserRound
      })
    )
  ]
};
