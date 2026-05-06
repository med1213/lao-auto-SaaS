import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AnalyticsService } from './core/analytics.service';

@Component({
  selector: 'lao-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <header class="la-header">
      <div class="la-container">
        <div class="la-header-inner">
          <a routerLink="/" class="la-logo" aria-label="LAOS AUTO home">
            <div class="la-logo-icon">LA</div>
            <div>LAOS <span>AUTO</span></div>
          </a>

          <nav class="la-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">{{ lang() === 'lo' ? 'ໜ້າຫຼັກ' : 'Home' }}</a>
            <a routerLink="/cars" routerLinkActive="active">{{ lang() === 'lo' ? 'ລົດທັງໝົດ' : 'All Cars' }}</a>
            <a routerLink="/contact" routerLinkActive="active">{{ lang() === 'lo' ? 'ຕິດຕໍ່' : 'Contact' }}</a>
            <a routerLink="/dashboard" routerLinkActive="active">Dealer</a>
          </nav>

          <div class="flex items-center gap-3">
            <div class="la-lang-toggle">
              <button type="button" [class.active]="lang() === 'lo'" (click)="setLang('lo')">ລາວ</button>
              <button type="button" [class.active]="lang() === 'en'" (click)="setLang('en')">EN</button>
            </div>
            <a routerLink="/cars" class="rounded-full bg-white/10 p-2 text-white md:hidden" aria-label="Search cars">
              <i-lucide name="search" class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>

    <router-outlet />
  `
})
export class AppComponent {
  lang = signal(localStorage.getItem('laosAutoLang') || 'lo');

  constructor(analytics: AnalyticsService) {
    analytics.init();
    document.body.classList.toggle('lang-en', this.lang() === 'en');
  }

  setLang(lang: 'lo' | 'en') {
    this.lang.set(lang);
    localStorage.setItem('laosAutoLang', lang);
    document.body.classList.toggle('lang-en', lang === 'en');
  }
}

