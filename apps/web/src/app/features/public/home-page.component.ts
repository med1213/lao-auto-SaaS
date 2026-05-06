import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { publicDemoCars } from '../../core/public-cars';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  standalone: true,
  imports: [RouterLink, CarCardComponent],
  template: `
    <main class="la-page-offset">
      <section class="hero">
        <div class="hero-bg">
          <img src="https://image.qwenlm.ai/public_source/973aa0b4-d54d-4a42-94b0-ffca7278ae88/1909ef06b-2b07-48fb-b574-7bf05ac1480f.png" alt="Luxury SUV">
        </div>
        <div class="hero-overlay"></div>
        <div class="la-container">
          <div class="hero-content">
            <div class="hero-badge"><span class="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]"></span> 🏆 #1 Car Dealer Platform in Laos</div>
            <h1 class="hero-title">ຄົ້ນພົບ <span class="highlight">ລົດໃນຝັນ</span> ຂອງທ່ານ</h1>
            <p class="hero-description">Premium new and used cars from trusted Lao dealerships. Fast chat, test-drive booking, financing support, and verified inventory.</p>
            <div class="hero-cta">
              <a routerLink="/cars" class="btn btn-primary">🚗 ເບິ່ງລົດທັງໝົດ</a>
              <a href="https://wa.me/8562012345678" class="btn btn-whatsapp">💬 WhatsApp</a>
              <a href="tel:+8562012345678" class="btn btn-secondary">📞 020 1234 5678</a>
            </div>
            <div class="hero-stats">
              <div><div class="hero-stat-value">500+</div><div class="hero-stat-label">Cars sold</div></div>
              <div><div class="hero-stat-value">15+</div><div class="hero-stat-label">Brands</div></div>
              <div><div class="hero-stat-value">98%</div><div class="hero-stat-label">Customer satisfaction</div></div>
            </div>
          </div>
        </div>
      </section>

      <div class="promo-banner">
        <div class="promo-scroll">
          @for (item of promoItems; track item) {
            <div class="promo-item">{{ item }}</div>
          }
          @for (item of promoItems; track item + 'b') {
            <div class="promo-item">{{ item }}</div>
          }
        </div>
      </div>

      <section class="featured-cars">
        <div class="la-container">
          <div class="section-header">
            <div class="section-label">Featured Cars</div>
            <h2 class="section-title">ລົດທີ່ນິຍົມທີ່ສຸດ</h2>
            <p class="section-subtitle">High-converting featured inventory with urgency, social proof, and one-click contact.</p>
          </div>
          <div class="cars-grid">
            @for (car of featured(); track car.id) {
              <lao-car-card [car]="car" />
            }
          </div>
          <div class="mt-10 text-center">
            <a routerLink="/cars" class="btn btn-dark">View All Cars →</a>
          </div>
        </div>
      </section>

      <section class="why-us">
        <div class="la-container">
          <div class="section-header">
            <div class="section-label">Why Choose Us</div>
            <h2 class="section-title">Trusted by Lao buyers and dealerships</h2>
          </div>
          <div class="why-grid">
            <div class="why-card"><div class="why-icon">🏆</div><h3 class="font-black">Certified Dealers</h3><p class="mt-2 text-sm text-gray-500">Verified dealer profiles and tenant-owned inventory.</p></div>
            <div class="why-card"><div class="why-icon">💰</div><h3 class="font-black">Best Prices</h3><p class="mt-2 text-sm text-gray-500">Promotions, featured offers, and financing-first CTAs.</p></div>
            <div class="why-card"><div class="why-icon">🔧</div><h3 class="font-black">Quality Warranty</h3><p class="mt-2 text-sm text-gray-500">Warranty and inspection messaging for buyer trust.</p></div>
            <div class="why-card"><div class="why-icon">💳</div><h3 class="font-black">Easy Financing</h3><p class="mt-2 text-sm text-gray-500">Monthly payment calculator built for conversion.</p></div>
          </div>
        </div>
      </section>

      <section class="promotions">
        <div class="la-container">
          <div class="section-header">
            <div class="section-label">Promotions</div>
            <h2 class="section-title !text-white">Special Offers</h2>
            <p class="section-subtitle !text-gray-400">Limited-time campaigns for featured dealer placements.</p>
          </div>
          <div class="promo-grid">
            <div class="promo-card promo-card-featured">
              <p class="font-black text-[var(--accent)]">🔥 Featured Deal</p>
              <h3 class="mt-3 text-2xl font-black">Save up to 50M LAK on SUVs</h3>
              <p class="mt-3 text-gray-400">Boost urgency with promotional labels, countdowns, and sticky booking actions.</p>
              <div class="timer-row">
                <div class="timer-block"><div class="timer-value">07</div><div class="text-xs text-gray-400">Days</div></div>
                <div class="timer-block"><div class="timer-value">12</div><div class="text-xs text-gray-400">Hours</div></div>
                <div class="timer-block"><div class="timer-value">30</div><div class="text-xs text-gray-400">Mins</div></div>
              </div>
              <a routerLink="/cars" class="btn btn-primary w-full">Book Now</a>
            </div>
            <div class="promo-card">
              <p class="font-black text-[var(--accent)]">💰 Easy Financing</p>
              <h3 class="mt-3 text-2xl font-black">0% Down, up to 72 months</h3>
              <p class="mt-3 text-gray-400">Give buyers a clear next step: calculate payments, contact dealer, or book test drive.</p>
              <a routerLink="/contact" class="btn btn-secondary mt-6 w-full">Ask About Financing</a>
            </div>
          </div>
        </div>
      </section>

      <section class="dealership-section">
        <div class="la-container dealership-grid">
          <div class="dealership-image">
            <img src="https://image.qwenlm.ai/public_source/973aa0b4-d54d-4a42-94b0-ffca7278ae88/1d463d7d3-76dd-4e30-951c-ea2756102dba.png" alt="LAOS AUTO dealership" loading="lazy">
          </div>
          <div>
            <div class="section-label">About Us</div>
            <h2 class="section-title">LAOS AUTO — The trusted dealer marketplace for Laos</h2>
            <p class="mt-5 leading-8 text-gray-600">A conversion-first SaaS public experience for dealerships: inventory, promotions, reviews, contact actions, and booking capture in one mobile-first flow.</p>
            <div class="mt-6 grid gap-3 font-bold text-gray-700">
              <span>✓ New and certified pre-owned cars</span>
              <span>✓ WhatsApp and Messenger lead capture</span>
              <span>✓ Dealer dashboards and platform monetization</span>
              <span>✓ Fast mobile UX for low-bandwidth buyers</span>
            </div>
          </div>
        </div>
      </section>

      <section class="financing-section">
        <div class="la-container">
          <div class="section-header">
            <div class="section-label">Financing Calculator</div>
            <h2 class="section-title">Calculate Your Installment</h2>
          </div>
          <div class="financing-card mx-auto max-w-2xl">
            <div class="grid gap-5">
              <label class="font-bold">Car price: {{ price().toLocaleString() }} LAK <input class="mt-2 w-full accent-yellow-500" type="range" min="100000000" max="1000000000" step="10000000" [value]="price()" (input)="price.set($any($event.target).valueAsNumber)"></label>
              <label class="font-bold">Down payment: {{ down().toLocaleString() }} LAK <input class="mt-2 w-full accent-yellow-500" type="range" min="0" max="500000000" step="5000000" [value]="down()" (input)="down.set($any($event.target).valueAsNumber)"></label>
              <label class="font-bold">Months: {{ months() }} <input class="mt-2 w-full accent-yellow-500" type="range" min="12" max="84" step="6" [value]="months()" (input)="months.set($any($event.target).valueAsNumber)"></label>
              <div class="rounded-xl bg-[var(--primary)] p-6 text-center">
                <p class="text-gray-400">Monthly payment</p>
                <p class="text-3xl font-black text-[var(--accent)]">₭{{ monthly().toLocaleString() }}</p>
                <p class="text-xs text-gray-500">Estimated at 3.5% annual interest</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="trust-section">
        <div class="la-container trust-grid">
          <div class="trust-item"><div class="trust-icon">🏆</div><h3 class="font-black">Certified</h3><p class="text-sm text-gray-500">Verified dealers</p></div>
          <div class="trust-item"><div class="trust-icon">🛡</div><h3 class="font-black">Warranty</h3><p class="text-sm text-gray-500">Quality promise</p></div>
          <div class="trust-item"><div class="trust-icon">🔍</div><h3 class="font-black">Inspected</h3><p class="text-sm text-gray-500">Listing approval</p></div>
          <div class="trust-item"><div class="trust-icon">📋</div><h3 class="font-black">Documents</h3><p class="text-sm text-gray-500">Ready to buy</p></div>
        </div>
      </section>

      <footer class="footer">
        <div class="la-container grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div><div class="la-logo"><div class="la-logo-icon">LA</div><div>LAOS <span>AUTO</span></div></div><p class="mt-4 max-w-md">Leading car dealership SaaS for Laos. Built for dealers, buyers, leads, and growth.</p></div>
          <div><h4 class="font-black text-white">Links</h4><a routerLink="/" class="mt-3 block">Home</a><a routerLink="/cars" class="mt-2 block">Cars</a><a routerLink="/contact" class="mt-2 block">Contact</a></div>
          <div><h4 class="font-black text-white">Types</h4><p class="mt-3">SUV</p><p>Pickup</p><p>EV</p><p>Sedan</p></div>
          <div><h4 class="font-black text-white">Contact</h4><a href="tel:+8562012345678" class="mt-3 block">020 1234 5678</a><a href="https://wa.me/8562012345678" class="mt-2 block">WhatsApp</a></div>
        </div>
      </footer>

      <div class="sticky-cta">
        <a href="tel:+8562012345678" class="btn btn-dark !px-2">📞 Call</a>
        <a href="https://wa.me/8562012345678" class="btn btn-whatsapp !px-2">💬 Chat</a>
        <a routerLink="/contact" class="btn btn-primary !px-2">🚗 Book</a>
      </div>

      <div class="floating-buttons">
        <a href="https://m.me/laosauto" class="float-btn float-btn-messenger">📘</a>
        <a href="https://wa.me/8562012345678" class="float-btn float-btn-whatsapp">💬</a>
        <a href="tel:+8562012345678" class="float-btn float-btn-phone">📞</a>
      </div>
    </main>
  `
})
export class HomePageComponent implements OnInit {
  cars = signal<Car[]>(publicDemoCars);
  featured = computed(() => this.cars().filter((car) => car.isFeatured).slice(0, 6));
  price = signal(500000000);
  down = signal(100000000);
  months = signal(60);
  monthly = computed(() => {
    const loan = Math.max(this.price() - this.down(), 0);
    const rate = 0.035 / 12;
    return Math.round((loan * (rate * Math.pow(1 + rate, this.months()))) / (Math.pow(1 + rate, this.months()) - 1));
  });
  promoItems = ['🔥 50M LAK OFF on SUVs', '🎁 Free 1-year insurance', '💰 0% down payment', '🏆 5-year warranty'];

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api
      .cars({ featured: true, limit: 8 })
      .pipe(catchError(() => of({ items: [] as Car[], total: 0, page: 1, limit: 8 })))
      .subscribe((res) => {
        if (res.items.length) this.cars.set(res.items);
      });
  }
}

