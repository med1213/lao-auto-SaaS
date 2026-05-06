import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Car } from '../core/models';
import { CompareService } from '../core/compare.service';
import { LakCurrencyPipe } from './currency.pipe';

@Component({
  selector: 'lao-car-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LakCurrencyPipe, LucideAngularModule],
  template: `
    <article class="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <a [routerLink]="['/cars', car.id]" class="block">
        <div class="relative aspect-[4/3] bg-stone-200">
          <img [src]="image" [alt]="car.make + ' ' + car.model" class="h-full w-full object-cover" loading="lazy">
          @if (car.isFeatured) {
            <span class="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-saffron px-2 py-1 text-xs font-bold text-ink"><i-lucide name="star" class="h-3 w-3" /> Featured</span>
          }
          @if (car.isLimitedStock) {
            <span class="absolute bottom-2 left-2 rounded bg-clay px-2 py-1 text-xs font-bold text-white">Limited stock</span>
          }
        </div>
        <div class="space-y-3 p-4">
          <div>
            <h3 class="line-clamp-1 text-lg font-black">{{ car.year }} {{ car.make }} {{ car.model }}</h3>
            <p class="line-clamp-1 text-sm text-black/60">{{ car.trim }} · {{ car.tenant?.name || car.location }}</p>
          </div>
          <p class="text-xl font-black text-forest">{{ car.priceLak | lak }}</p>
          <div class="flex items-center justify-between text-xs text-black/60">
            <span class="inline-flex items-center gap-1"><i-lucide name="gauge" class="h-4 w-4" /> {{ car.mileageKm || 0 | number }} km</span>
            <span class="inline-flex items-center gap-1"><i-lucide name="eye" class="h-4 w-4" /> {{ car.viewCount }}</span>
          </div>
          <button type="button" (click)="compare.toggle(car); $event.preventDefault(); $event.stopPropagation()" class="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md border border-black/10 py-2 text-sm font-bold hover:bg-forest/10">
            <i-lucide name="scale" class="h-4 w-4" /> {{ compare.has(car.id) ? 'Remove compare' : 'Compare' }}
          </button>
        </div>
      </a>
    </article>
  `
})
export class CarCardComponent {
  @Input({ required: true }) car!: Car;

  constructor(public readonly compare: CompareService) {}

  get image() {
    return this.car.images?.find((image) => image.isPrimary)?.url || this.car.images?.[0]?.url || 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=70';
  }
}
