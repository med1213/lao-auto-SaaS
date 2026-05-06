import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  standalone: true,
  imports: [RouterLink, CarCardComponent, LucideAngularModule],
  template: `
    <main>
      <section class="bg-white">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-12">
          <div class="space-y-6">
            <div class="inline-flex rounded bg-forest/10 px-3 py-1 text-sm font-bold text-forest">Lao + English · LAK pricing · verified dealers</div>
            <h1 class="max-w-3xl text-4xl font-black leading-tight md:text-6xl">Find trusted cars from dealers across Laos</h1>
            <p class="max-w-2xl text-lg text-black/65">Browse inventory, compare deals, chat with dealers, and book a test drive in one flow built for mobile buyers.</p>
            <form routerLink="/cars" class="flex max-w-xl items-center gap-2 rounded-lg border border-black/10 bg-white p-2 shadow-sm">
              <i-lucide name="search" class="ml-2 h-5 w-5 text-black/40" />
              <input class="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 outline-none" placeholder="Toyota, Ford, pickup, SUV">
              <button class="focus-ring rounded-md bg-forest px-5 py-3 font-bold text-white">Search</button>
            </form>
          </div>
          <div class="relative min-h-[360px] overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=75" alt="Featured car" class="absolute inset-0 h-full w-full object-cover">
            <div class="absolute inset-x-4 bottom-4 rounded-lg bg-white/92 p-4 shadow-lg">
              <p class="text-sm font-bold text-clay">Premium placement available</p>
              <p class="text-2xl font-black">Boost dealer inventory and capture hotter leads</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-10">
        <div class="mb-5 flex items-end justify-between">
          <div>
            <p class="font-bold text-forest">Featured cars</p>
            <h2 class="text-2xl font-black">High intent inventory</h2>
          </div>
          <a routerLink="/cars" class="font-bold text-forest">View all</a>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (car of featured(); track car.id) {
            <lao-car-card [car]="car" />
          }
        </div>
      </section>

      <div class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-black/10 bg-white p-2 md:hidden">
        <a href="tel:+8562000000000" class="flex flex-col items-center gap-1 rounded-md py-2 text-xs font-bold"><i-lucide name="phone" class="h-5 w-5" /> Call</a>
        <a href="https://wa.me/8562000000000" class="flex flex-col items-center gap-1 rounded-md py-2 text-xs font-bold"><i-lucide name="message-circle" class="h-5 w-5" /> Chat</a>
        <a routerLink="/cars" class="flex flex-col items-center gap-1 rounded-md bg-forest py-2 text-xs font-bold text-white"><i-lucide name="calendar-check" class="h-5 w-5" /> Book</a>
      </div>
    </main>
  `
})
export class HomePageComponent implements OnInit {
  featured = signal<Car[]>([]);

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.cars({ featured: true, limit: 8 }).subscribe((res) => this.featured.set(res.items));
  }
}
