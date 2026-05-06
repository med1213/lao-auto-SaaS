import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompareService } from '../../core/compare.service';
import { LakCurrencyPipe } from '../../shared/currency.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, LakCurrencyPipe],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="mb-6 flex items-end justify-between">
        <div>
          <p class="font-bold text-forest">Compare</p>
          <h1 class="text-3xl font-black">Shortlist cars</h1>
        </div>
        <button (click)="compare.clear()" class="rounded-md border border-black/10 bg-white px-4 py-2 font-bold">Clear</button>
      </div>
      @if (compare.cars().length) {
        <div class="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table class="w-full min-w-[760px] text-left">
            <thead>
              <tr class="border-b border-black/10">
                <th class="p-4">Car</th>
                @for (car of compare.cars(); track car.id) {
                  <th class="p-4"><a [routerLink]="['/cars', car.id]" class="text-forest">{{ car.year }} {{ car.make }} {{ car.model }}</a></th>
                }
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-black/10"><td class="p-4 font-bold">Price</td>@for (car of compare.cars(); track car.id) { <td class="p-4">{{ car.priceLak | lak }}</td> }</tr>
              <tr class="border-b border-black/10"><td class="p-4 font-bold">Mileage</td>@for (car of compare.cars(); track car.id) { <td class="p-4">{{ car.mileageKm || 0 | number }} km</td> }</tr>
              <tr class="border-b border-black/10"><td class="p-4 font-bold">Fuel</td>@for (car of compare.cars(); track car.id) { <td class="p-4">{{ car.fuelType || 'Petrol' }}</td> }</tr>
              <tr class="border-b border-black/10"><td class="p-4 font-bold">Transmission</td>@for (car of compare.cars(); track car.id) { <td class="p-4">{{ car.transmission || 'Auto' }}</td> }</tr>
              <tr><td class="p-4 font-bold">Dealer</td>@for (car of compare.cars(); track car.id) { <td class="p-4">{{ car.tenant?.name || car.location }}</td> }</tr>
            </tbody>
          </table>
        </div>
      } @else {
        <div class="rounded-lg bg-white p-8 text-center">
          <h2 class="text-xl font-black">No cars selected</h2>
          <a routerLink="/cars" class="mt-4 inline-block rounded-md bg-forest px-5 py-3 font-bold text-white">Browse cars</a>
        </div>
      }
    </main>
  `
})
export class ComparePageComponent {
  constructor(public readonly compare: CompareService) {}
}
