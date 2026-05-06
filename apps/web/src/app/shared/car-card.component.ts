import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CompareService } from '../core/compare.service';
import { Car } from '../core/models';
import { LakCurrencyPipe } from './currency.pipe';

@Component({
  selector: 'lao-car-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LakCurrencyPipe, LucideAngularModule],
  template: `
    <article class="car-card">
      <a [routerLink]="['/cars', car.id]" class="block">
        <div class="car-card-image">
          <img [src]="image" [alt]="car.make + ' ' + car.model" loading="lazy">
          @if (car.isFeatured) {
            <span class="badge badge-accent absolute left-3 top-3"><i-lucide name="star" class="mr-1 h-3 w-3" /> Featured</span>
          }
          @if (car.isLimitedStock) {
            <span class="badge badge-danger absolute bottom-3 left-3">Limited stock</span>
          }
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">{{ car.year }} {{ car.make }} {{ car.model }}</h3>
          <p class="car-card-subtitle">{{ car.trim }} · {{ car.tenant?.name || car.location }}</p>

          <div class="car-card-specs">
            <span class="car-spec">⛽ {{ car.fuelType || 'Petrol' }}</span>
            <span class="car-spec">⚙ {{ car.transmission || 'Auto' }}</span>
            <span class="car-spec">📅 {{ car.year }}</span>
            <span class="car-spec"><i-lucide name="gauge" class="inline h-3 w-3" /> {{ car.mileageKm || 0 | number }} km</span>
          </div>

          <div class="car-card-footer">
            <div class="car-price">{{ car.priceLak | lak }}</div>
            <span class="car-card-cta">View Details</span>
          </div>

          <button type="button" (click)="compare.toggle(car); $event.preventDefault(); $event.stopPropagation()" class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-black/10 py-2 text-sm font-bold hover:bg-yellow-50">
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

