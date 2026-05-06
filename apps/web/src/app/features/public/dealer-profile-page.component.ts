import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Car, Tenant } from '../../core/models';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  standalone: true,
  imports: [CarCardComponent],
  template: `
    @if (dealer(); as d) {
      <main>
        <section class="bg-white">
          <div class="mx-auto max-w-7xl px-4 py-8">
            <p class="font-bold text-forest">Verified dealer</p>
            <h1 class="text-4xl font-black">{{ d.name }}</h1>
            <p class="mt-2 max-w-2xl text-black/65">{{ d.address }}</p>
          </div>
        </section>
        <section class="mx-auto max-w-7xl px-4 py-8">
          <h2 class="mb-4 text-2xl font-black">Inventory</h2>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (car of cars(); track car.id) {
              <lao-car-card [car]="car" />
            }
          </div>
        </section>
      </main>
    }
  `
})
export class DealerProfilePageComponent implements OnInit {
  dealer = signal<Tenant | undefined>(undefined);
  cars = signal<Car[]>([]);

  constructor(private readonly route: ActivatedRoute, private readonly api: ApiService) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.dealer(slug).subscribe((dealer) => this.dealer.set(dealer));
    this.api.cars({ dealer: slug }).subscribe((res) => this.cars.set(res.items));
  }
}

