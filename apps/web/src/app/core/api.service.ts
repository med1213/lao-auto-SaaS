import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Car, CarImage, Paged, Tenant } from './models';

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

  createCar(dto: Partial<Car>) {
    return this.http.post<Car>(`${this.baseUrl}/cars`, dto);
  }

  updateCar(id: string, dto: Partial<Car>) {
    return this.http.patch<Car>(`${this.baseUrl}/cars/${id}`, dto);
  }

  deleteCar(id: string) {
    return this.http.delete(`${this.baseUrl}/cars/${id}`);
  }

  /** Upload a single image file to a specific car. Returns the new CarImage record. */
  uploadCarImage(carId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CarImage>(`${this.baseUrl}/cars/${carId}/images/upload`, formData);
  }

  /** Delete a specific image from a car */
  deleteCarImage(carId: string, imageId: string) {
    return this.http.delete(`${this.baseUrl}/cars/${carId}/images/${imageId}`);
  }

  dealers() {
    return this.http.get<Tenant[]>(`${this.baseUrl}/dealers`);
  }

  dealer(slug: string) {
    return this.http.get<Tenant>(`${this.baseUrl}/dealers/${slug}`);
  }

  createDealer(dto: Partial<Tenant>) {
    return this.http.post<Tenant>(`${this.baseUrl}/dealers`, dto);
  }

  updateDealer(id: string, dto: Partial<Tenant>) {
    return this.http.patch<Tenant>(`${this.baseUrl}/dealers/${id}`, dto);
  }

  deleteDealer(id: string) {
    return this.http.delete(`${this.baseUrl}/dealers/${id}`);
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
