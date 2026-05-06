import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AnalyticsService } from './core/analytics.service';

@Component({
  selector: 'lao-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LucideAngularModule],
  template: `
    <header class="sticky top-0 z-40 border-b border-black/10 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a routerLink="/" class="text-xl font-black tracking-tight text-forest">Lao Auto</a>
        <div class="hidden items-center gap-6 text-sm font-semibold md:flex">
          <a routerLink="/cars" class="hover:text-forest">Cars</a>
          <a routerLink="/dashboard" class="hover:text-forest">Dealer</a>
          <a routerLink="/admin" class="hover:text-forest">Admin</a>
        </div>
        <div class="flex items-center gap-2">
          <a routerLink="/cars" class="focus-ring rounded-md p-2 hover:bg-forest/10" aria-label="Search cars"><i-lucide name="search" class="h-5 w-5" /></a>
          <a routerLink="/dashboard" class="focus-ring rounded-md p-2 hover:bg-forest/10" aria-label="Dashboard"><i-lucide name="user-round" class="h-5 w-5" /></a>
          <button class="focus-ring rounded-md p-2 md:hidden" aria-label="Menu"><i-lucide name="menu" class="h-5 w-5" /></button>
        </div>
      </nav>
    </header>
    <router-outlet />
  `
})
export class AppComponent {
  constructor(analytics: AnalyticsService) {
    analytics.init();
  }
}
