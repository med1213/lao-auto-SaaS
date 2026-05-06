import { Injectable, signal } from '@angular/core';
import { Car } from './models';

const STORAGE_KEY = 'lao_auto_compare';

@Injectable({ providedIn: 'root' })
export class CompareService {
  readonly cars = signal<Car[]>(this.read());

  toggle(car: Car) {
    const exists = this.has(car.id);
    const next = exists ? this.cars().filter((item) => item.id !== car.id) : [...this.cars(), car].slice(-3);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    this.cars.set(next);
  }

  has(id: string) {
    return this.cars().some((car) => car.id === id);
  }

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    this.cars.set([]);
  }

  private read(): Car[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Car[];
    } catch {
      return [];
    }
  }
}

