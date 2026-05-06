import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Car, Paged, Tenant } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  cars(params: Record<string, string | number | boolean | undefined> = {}) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') httpParams = httpParams.set(key, String(value));
    });
    return this.http.get<Paged<Car>>(`${this.baseUrl}/cars`, { params: httpParams });
  }

  car(id: string) {
    return this.http.get<Car>(`${this.baseUrl}/cars/${id}`);
  }

  dealers() {
    return this.http.get<Tenant[]>(`${this.baseUrl}/dealers`);
  }

  dealer(slug: string) {
    return this.http.get<Tenant>(`${this.baseUrl}/dealers/${slug}`);
  }

  createLead(payload: { tenantId: string; carId?: string; name: string; phone: string; message?: string; source?: string }) {
    return this.http.post(`${this.baseUrl}/leads`, payload);
  }

  createBooking(payload: { tenantId: string; carId: string; name: string; phone: string; preferredAt: string }) {
    return this.http.post(`${this.baseUrl}/bookings`, payload);
  }

  dealerCars() {
    return this.http.get<Car[]>(`${this.baseUrl}/cars/dealer/me`);
  }

  dealerLeads() {
    return this.http.get<unknown[]>(`${this.baseUrl}/leads`);
  }

  dealerBookings() {
    return this.http.get<unknown[]>(`${this.baseUrl}/bookings`);
  }
}

