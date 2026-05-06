import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  standalone: true,
  imports: [FormsModule, CarCardComponent, LucideAngularModule],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-3xl font-black">Cars in Laos</h1>
          <p class="text-black/60">{{ total() }} listings from verified dealers</p>
        </div>
        <form (ngSubmit)="load()" class="grid gap-2 rounded-lg border border-black/10 bg-white p-3 md:grid-cols-5">
          <input [(ngModel)]="filters.q" name="q" class="rounded-md border border-black/10 px-3 py-2" placeholder="Search">
          <input [(ngModel)]="filters.make" name="make" class="rounded-md border border-black/10 px-3 py-2" placeholder="Make">
          <input [(ngModel)]="filters.minPrice" name="minPrice" type="number" class="rounded-md border border-black/10 px-3 py-2" placeholder="Min ₭">
          <input [(ngModel)]="filters.maxPrice" name="maxPrice" type="number" class="rounded-md border border-black/10 px-3 py-2" placeholder="Max ₭">
          <button class="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-forest px-4 py-2 font-bold text-white"><i-lucide name="sliders-horizontal" class="h-4 w-4" /> Filter</button>
        </form>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (car of cars(); track car.id) {
          <lao-car-card [car]="car" />
        }
      </div>
    </main>
  `
})
export class CarListPageComponent implements OnInit {
  cars = signal<Car[]>([]);
  total = signal(0);
  filters = { q: '', make: '', minPrice: undefined as number | undefined, maxPrice: undefined as number | undefined };

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.cars(this.filters).subscribe((res) => {
      this.cars.set(res.items);
      this.total.set(res.total);
    });
  }
}
