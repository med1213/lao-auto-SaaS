import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { publicDemoCars } from '../../core/public-cars';
import { LakCurrencyPipe } from '../../shared/currency.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LakCurrencyPipe],
  template: `
    @if (car(); as item) {
      <main class="la-page-offset bg-white">
        <div class="la-container py-6">
          <a routerLink="/cars" class="inline-flex items-center gap-2 py-3 font-bold text-gray-500 hover:text-[var(--accent)]">← Back to listings</a>

          <section class="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--gray-900)]">
            <div class="gallery-main h-[360px] md:h-[520px]">
              <img [src]="heroImage(item)" [alt]="item.make + ' ' + item.model">
            </div>
            <div class="flex gap-2 overflow-x-auto p-3">
              @for (image of gallery(item); track image.url) {
                <img [src]="image.url" alt="" class="h-16 w-24 shrink-0 rounded-md object-cover ring-2 ring-[var(--accent)]">
              }
            </div>
          </section>

          <section class="detail-content mt-8">
            <div>
              <p class="font-black text-[var(--accent)]">{{ item.tenant?.name || 'LAOS AUTO' }}</p>
              <h1 class="mt-1 text-4xl font-black text-gray-950">{{ item.year }} {{ item.make }} {{ item.model }}</h1>
              <p class="mt-1 text-gray-500">{{ item.trim }}</p>

              <div class="my-6 rounded-2xl bg-[var(--gray-100)] p-6">
                <span class="text-4xl font-black text-[var(--accent)]">{{ item.priceLak | lak }}</span>
                <p class="mt-1 text-sm text-gray-500">Estimated installment: {{ monthly(item) | lak }}/month</p>
              </div>

              <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div class="rounded-xl bg-[var(--gray-100)] p-4 text-center"><div class="text-2xl">⛽</div><b>{{ item.fuelType || 'Petrol' }}</b><p class="text-xs text-gray-500">Fuel</p></div>
                <div class="rounded-xl bg-[var(--gray-100)] p-4 text-center"><div class="text-2xl">⚙</div><b>{{ item.transmission || 'Auto' }}</b><p class="text-xs text-gray-500">Transmission</p></div>
                <div class="rounded-xl bg-[var(--gray-100)] p-4 text-center"><div class="text-2xl">📅</div><b>{{ item.year }}</b><p class="text-xs text-gray-500">Year</p></div>
                <div class="rounded-xl bg-[var(--gray-100)] p-4 text-center"><div class="text-2xl">🚗</div><b>{{ item.mileageKm || 0 | number }} km</b><p class="text-xs text-gray-500">Mileage</p></div>
                <div class="rounded-xl bg-[var(--gray-100)] p-4 text-center"><div class="text-2xl">📍</div><b>{{ item.location || 'Laos' }}</b><p class="text-xs text-gray-500">Location</p></div>
                <div class="rounded-xl bg-[var(--gray-100)] p-4 text-center"><div class="text-2xl">🏷</div><b>{{ item.bodyType || 'Car' }}</b><p class="text-xs text-gray-500">Type</p></div>
              </div>

              <div class="mt-8">
                <h2 class="text-xl font-black">Features</h2>
                <div class="mt-4 grid gap-2 sm:grid-cols-2">
                  @for (feature of features; track feature) {
                    <div class="font-bold text-gray-600"><span class="text-[var(--success)]">✓</span> {{ feature }}</div>
                  }
                </div>
              </div>

              <p class="mt-8 leading-8 text-gray-600">{{ item.description }}</p>
            </div>

            <aside>
              <div class="sidebar-card sticky top-28">
                <h2 class="text-xl font-black">📞 Contact dealer</h2>
                <p class="mt-1 text-sm text-gray-500">Fast response through phone, WhatsApp, Messenger, or booking request.</p>
                <div class="mt-5 grid gap-3">
                  <a [href]="whatsapp(item)" class="btn btn-whatsapp w-full">💬 WhatsApp</a>
                  <a href="https://m.me/laosauto" class="btn w-full bg-[#0084ff] text-white">📘 Messenger</a>
                  <a [href]="'tel:' + (item.tenant?.phone || '+8562012345678')" class="btn btn-dark w-full">📞 Call Now</a>
                </div>

                <form (ngSubmit)="book(item)" class="mt-6 grid gap-3">
                  <h3 class="font-black">🚗 Book Test Drive</h3>
                  <input [(ngModel)]="form.name" name="name" required class="form-input" placeholder="Your name">
                  <input [(ngModel)]="form.phone" name="phone" required class="form-input" placeholder="Phone number">
                  <input [(ngModel)]="form.preferredAt" name="preferredAt" type="datetime-local" required class="form-input">
                  <button class="btn btn-primary w-full">Confirm Booking</button>
                  @if (message()) {
                    <p class="rounded-lg bg-green-50 p-3 text-sm font-bold text-green-700">{{ message() }}</p>
                  }
                </form>
              </div>
            </aside>
          </section>
        </div>
      </main>
    }
  `
})
export class CarDetailPageComponent implements OnInit {
  car = signal<Car | undefined>(undefined);
  message = signal('');
  form = { name: '', phone: '', preferredAt: '' };
  features = ['Leather Seats', 'Navigation', 'Backup Camera', 'Apple CarPlay', 'Blind Spot Monitor', 'Warranty Included', 'Finance Available', 'Verified Documents'];

  constructor(private readonly route: ActivatedRoute, private readonly api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const demo = publicDemoCars.find((car) => car.id === id);
    if (demo) {
      this.car.set(demo);
      return;
    }
    this.api
      .car(id)
      .pipe(catchError(() => of(publicDemoCars[0])))
      .subscribe((car) => this.car.set(car));
  }

  heroImage(car: Car) {
    return car.images?.find((image) => image.isPrimary)?.url || car.images?.[0]?.url || publicDemoCars[0].images[0].url;
  }

  gallery(car: Car) {
    return car.images?.length ? car.images : publicDemoCars[0].images;
  }

  monthly(car: Car) {
    return Math.round(Number(car.priceLak) * 0.7 / 60);
  }

  whatsapp(car: Car) {
    const phone = car.tenant?.whatsapp || car.tenant?.phone || '+8562012345678';
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I am interested in ${car.year} ${car.make} ${car.model}`)}`;
  }

  book(car: Car) {
    if (car.id.startsWith('demo-')) {
      this.message.set('Booking captured. Dealer will contact you soon.');
      return;
    }
    this.api.createBooking({ tenantId: car.tenantId, carId: car.id, ...this.form, preferredAt: new Date(this.form.preferredAt).toISOString() }).subscribe(() => this.message.set('Booking captured. Dealer will contact you soon.'));
  }
}

