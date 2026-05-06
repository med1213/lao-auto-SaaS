import { Component, OnInit, computed, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  standalone: true,
  imports: [CarCardComponent],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="font-bold text-forest">Dealer workspace</p>
          <h1 class="text-3xl font-black">Inventory, leads, and bookings</h1>
        </div>
        <button class="focus-ring rounded-md bg-forest px-5 py-3 font-bold text-white">Add car</button>
      </div>
      <section class="grid gap-3 md:grid-cols-4">
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Cars</p><p class="text-3xl font-black">{{ cars().length }}</p></div>
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Views</p><p class="text-3xl font-black">{{ views() }}</p></div>
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Leads</p><p class="text-3xl font-black">{{ leads().length }}</p></div>
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Bookings</p><p class="text-3xl font-black">{{ bookings().length }}</p></div>
      </section>
      <section class="mt-8">
        <h2 class="mb-4 text-2xl font-black">Your cars</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (car of cars(); track car.id) {
            <lao-car-card [car]="car" />
          }
        </div>
      </section>
    </main>
  `
})
export class DealerDashboardComponent implements OnInit {
  cars = signal<Car[]>([]);
  leads = signal<unknown[]>([]);
  bookings = signal<unknown[]>([]);
  views = computed(() => this.cars().reduce((sum, car) => sum + car.viewCount, 0));

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.dealerCars().subscribe((cars) => this.cars.set(cars));
    this.api.dealerLeads().subscribe((leads) => this.leads.set(leads));
    this.api.dealerBookings().subscribe((bookings) => this.bookings.set(bookings));
  }
}

