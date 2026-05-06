import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { LakCurrencyPipe } from '../../shared/currency.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LakCurrencyPipe, LucideAngularModule],
  template: `
    @if (car(); as item) {
      <main class="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1fr_380px]">
        <section>
          <div class="overflow-hidden rounded-lg bg-white">
            <img [src]="heroImage(item)" [alt]="item.make + ' ' + item.model" class="aspect-[16/10] w-full object-cover" loading="eager">
          </div>
          <div class="mt-5 grid grid-cols-4 gap-2">
            @for (image of item.images; track image.url) {
              <img [src]="image.url" alt="" class="aspect-square rounded-md object-cover" loading="lazy">
            }
          </div>
          <div class="mt-8">
            <p class="font-bold text-forest">{{ item.tenant?.name }}</p>
            <h1 class="text-4xl font-black">{{ item.year }} {{ item.make }} {{ item.model }} {{ item.trim }}</h1>
            <p class="mt-2 text-3xl font-black text-forest">{{ item.priceLak | lak }}</p>
            <dl class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div class="rounded-md bg-white p-4"><dt class="text-xs text-black/50">Mileage</dt><dd class="font-bold">{{ item.mileageKm || 0 | number }} km</dd></div>
              <div class="rounded-md bg-white p-4"><dt class="text-xs text-black/50">Fuel</dt><dd class="font-bold">{{ item.fuelType || 'Petrol' }}</dd></div>
              <div class="rounded-md bg-white p-4"><dt class="text-xs text-black/50">Transmission</dt><dd class="font-bold">{{ item.transmission || 'Auto' }}</dd></div>
              <div class="rounded-md bg-white p-4"><dt class="text-xs text-black/50">Location</dt><dd class="font-bold">{{ item.location || 'Laos' }}</dd></div>
            </dl>
            <p class="mt-6 whitespace-pre-line text-black/70">{{ item.description }}</p>
          </div>
        </section>

        <aside class="h-fit rounded-lg border border-black/10 bg-white p-5 shadow-sm lg:sticky lg:top-20">
          <h2 class="text-xl font-black">Contact dealer</h2>
          <p class="text-sm text-black/60">Fast response through phone, WhatsApp, or booking request.</p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <a [href]="'tel:' + item.tenant?.phone" class="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-black/10 py-3 font-bold"><i-lucide name="phone" class="h-4 w-4" /> Call</a>
            <a [href]="whatsapp(item)" class="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-forest py-3 font-bold text-white"><i-lucide name="message-circle" class="h-4 w-4" /> Chat</a>
          </div>
          <form (ngSubmit)="book(item)" class="mt-5 space-y-3">
            <input [(ngModel)]="form.name" name="name" required class="w-full rounded-md border border-black/10 px-3 py-3" placeholder="Your name">
            <input [(ngModel)]="form.phone" name="phone" required class="w-full rounded-md border border-black/10 px-3 py-3" placeholder="Phone number">
            <input [(ngModel)]="form.preferredAt" name="preferredAt" type="datetime-local" required class="w-full rounded-md border border-black/10 px-3 py-3">
            <button class="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-clay py-3 font-black text-white"><i-lucide name="calendar-check" class="h-5 w-5" /> Book Test Drive</button>
          </form>
        </aside>
      </main>
    }
  `
})
export class CarDetailPageComponent implements OnInit {
  car = signal<Car | undefined>(undefined);
  form = { name: '', phone: '', preferredAt: '' };

  constructor(private readonly route: ActivatedRoute, private readonly api: ApiService) {}

  ngOnInit() {
    this.api.car(this.route.snapshot.paramMap.get('id')!).subscribe((car) => this.car.set(car));
  }

  heroImage(car: Car) {
    return car.images?.[0]?.url || 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=75';
  }

  whatsapp(car: Car) {
    const phone = car.tenant?.whatsapp || car.tenant?.phone || '';
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`I'm interested in ${car.year} ${car.make} ${car.model}`)}`;
  }

  book(car: Car) {
    this.api.createBooking({ tenantId: car.tenantId, carId: car.id, ...this.form, preferredAt: new Date(this.form.preferredAt).toISOString() }).subscribe();
  }
}
