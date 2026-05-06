import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { publicDemoCars } from '../../core/public-cars';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  standalone: true,
  imports: [FormsModule, CarCardComponent],
  template: `
    <main class="la-page-offset min-h-screen bg-[var(--gray-100)]">
      <section class="bg-[var(--primary)] py-12 text-white">
        <div class="la-container">
          <h1 class="text-4xl font-black">ລົດທັງໝົດ</h1>
          <p class="mt-2 text-gray-400">Find the perfect car for you from verified Lao dealers.</p>
        </div>
      </section>

      <section class="sticky top-[72px] z-40 border-b border-black/10 bg-white py-4 shadow-sm">
        <div class="la-container">
          <div class="flex flex-wrap items-center gap-3">
            <input [(ngModel)]="q" class="form-input max-w-xs" placeholder="Search Toyota, SUV, EV">
            <select [(ngModel)]="brand" class="form-input max-w-[180px]">
              <option value="">All Brands</option>
              <option>Toyota</option>
              <option>Honda</option>
              <option>Ford</option>
              <option>BYD</option>
              <option>Mitsubishi</option>
              <option>Hyundai</option>
            </select>
            <select [(ngModel)]="type" class="form-input max-w-[180px]">
              <option value="">All Types</option>
              <option>SUV</option>
              <option>Sedan</option>
              <option>Pickup</option>
              <option>EV</option>
            </select>
            <select [(ngModel)]="sort" class="form-input max-w-[190px]">
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
            </select>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            @for (chip of ['', 'SUV', 'Sedan', 'Pickup', 'EV']; track chip) {
              <button type="button" class="rounded-full border px-4 py-2 text-sm font-bold" [class.bg-yellow-400]="type === chip" [class.border-yellow-400]="type === chip" (click)="type = chip">{{ chip || 'All' }}</button>
            }
          </div>
        </div>
      </section>

      <section class="la-container py-8">
        <p class="mb-5 text-sm text-gray-500">Found <span class="font-black text-gray-900">{{ filtered().length }}</span> cars</p>
        <div class="listings-grid">
          @for (car of filtered(); track car.id) {
            <lao-car-card [car]="car" />
          } @empty {
            <div class="col-span-full rounded-2xl bg-white p-12 text-center">
              <p class="text-5xl">🔍</p>
              <h2 class="mt-4 text-2xl font-black">No cars found</h2>
              <p class="text-gray-500">Try changing the filters.</p>
            </div>
          }
        </div>
      </section>
    </main>
  `
})
export class CarListPageComponent implements OnInit {
  cars = signal<Car[]>(publicDemoCars);
  q = '';
  brand = '';
  type = '';
  sort = 'newest';

  filtered = computed(() => {
    const query = this.q.toLowerCase().trim();
    let items = [...this.cars()];
    if (query) {
      items = items.filter((car) => `${car.make} ${car.model} ${car.trim} ${car.bodyType}`.toLowerCase().includes(query));
    }
    if (this.brand) items = items.filter((car) => car.make === this.brand);
    if (this.type) items = items.filter((car) => car.bodyType === this.type);
    if (this.sort === 'price-low') items.sort((a, b) => Number(a.priceLak) - Number(b.priceLak));
    if (this.sort === 'price-high') items.sort((a, b) => Number(b.priceLak) - Number(a.priceLak));
    if (this.sort === 'newest') items.sort((a, b) => b.year - a.year);
    return items;
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api
      .cars({ limit: 48 })
      .pipe(catchError(() => of({ items: [] as Car[], total: 0, page: 1, limit: 48 })))
      .subscribe((res) => {
        if (res.items.length) this.cars.set(res.items);
      });
  }
}

