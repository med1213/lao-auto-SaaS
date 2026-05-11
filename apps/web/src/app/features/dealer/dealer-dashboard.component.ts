import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Car } from '../../core/models';
import { publicDemoCars } from '../../core/public-cars';
import { LakCurrencyPipe } from '../../shared/currency.pipe';

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  car?: { make?: string; model?: string };
  createdAt: string;
};

type BookingRow = {
  id: string;
  name: string;
  phone: string;
  status: string;
  preferredAt: string;
  car?: { make?: string; model?: string };
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LakCurrencyPipe],
  template: `
    <main class="min-h-screen bg-[#eef1f5] pt-[72px]">
      <div class="grid min-h-[calc(100vh-72px)] lg:grid-cols-[280px_1fr]">
        <aside class="hidden border-r border-black/10 bg-[#101216] text-white lg:block">
          <div class="p-6">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">Dealer Cpanel</p>
            <h1 class="mt-2 text-2xl font-black">LAOS AUTO</h1>
          </div>
          <nav class="grid gap-1 px-3 text-sm font-bold">
            @for (item of nav; track item.id) {
              <button class="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10" [class.bg-[var(--accent)]]="activeTab() === item.id" [class.text-black]="activeTab() === item.id" (click)="activeTab.set(item.id)">
                <span>{{ item.icon }}</span>{{ item.label }}
              </button>
            }
          </nav>
          <div class="m-4 mt-8 rounded-2xl bg-white/10 p-4">
            <p class="text-sm font-black">Current Plan</p>
            <p class="mt-1 text-2xl font-black text-[var(--accent)]">Pro Dealer</p>
            <p class="mt-2 text-xs text-gray-300">42 listings available · Featured boosts enabled</p>
          </div>
        </aside>

        <section class="min-w-0">
          <header class="sticky top-[72px] z-30 border-b border-black/10 bg-white/95 backdrop-blur">
            <div class="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
              <div>
                <p class="text-sm font-black text-[var(--accent)]">Dealer Workspace</p>
                <h2 class="text-2xl font-black text-gray-950">Inventory, leads, bookings, analytics</h2>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="btn btn-dark !min-h-10 !px-4" (click)="activeTab.set('inventory')">Manage Cars</button>
                <button class="btn btn-primary !min-h-10 !px-4" (click)="openCreateModal()">+ Add Car</button>
              </div>
            </div>
          </header>

          <div class="p-4 lg:p-8">
            <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              @for (metric of metrics(); track metric.label) {
                <div class="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-bold text-gray-500">{{ metric.label }}</p>
                    <span class="rounded-xl bg-yellow-50 px-3 py-2">{{ metric.icon }}</span>
                  </div>
                  <p class="mt-4 text-4xl font-black text-gray-950">{{ metric.value }}</p>
                  <p class="mt-1 text-xs font-bold" [class.text-green-600]="metric.good" [class.text-gray-400]="!metric.good">{{ metric.note }}</p>
                </div>
              }
            </section>

            @if (activeTab() === 'overview') {
              <section class="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
                <div class="rounded-2xl bg-white p-5 shadow-sm">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="text-xl font-black">Conversion Funnel</h3>
                    <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Live</span>
                  </div>
                  <div class="grid gap-3">
                    @for (step of funnel(); track step.label) {
                      <div>
                        <div class="mb-1 flex justify-between text-sm font-bold"><span>{{ step.label }}</span><span>{{ step.value }}</span></div>
                        <div class="h-3 overflow-hidden rounded-full bg-gray-100"><div class="h-full rounded-full bg-[var(--accent)]" [style.width.%]="step.percent"></div></div>
                      </div>
                    }
                  </div>
                </div>

                <div class="rounded-2xl bg-[#101216] p-5 text-white shadow-sm">
                  <h3 class="text-xl font-black">Quick Actions</h3>
                  <div class="mt-4 grid gap-3">
                    <button class="rounded-xl bg-white/10 p-4 text-left font-bold hover:bg-white/15" (click)="activeTab.set('leads')">📞 Follow up new leads</button>
                    <button class="rounded-xl bg-white/10 p-4 text-left font-bold hover:bg-white/15" (click)="activeTab.set('bookings')">🚗 Confirm test drives</button>
                    <button class="rounded-xl bg-white/10 p-4 text-left font-bold hover:bg-white/15" (click)="activeTab.set('inventory')">⭐ Boost featured listings</button>
                  </div>
                </div>
              </section>
            }

            @if (activeTab() === 'inventory') {
              <section class="mt-6 rounded-2xl bg-white shadow-sm">
                <div class="flex flex-col gap-3 border-b border-black/10 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 class="text-xl font-black">Inventory Manager</h3>
                    <p class="text-sm text-gray-500">Create, edit, feature, and monitor dealer listings.</p>
                  </div>
                  <input [(ngModel)]="inventorySearch" class="form-input max-w-sm" placeholder="Search inventory">
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[900px] text-left text-sm">
                    <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr><th class="p-4">Car</th><th class="p-4">Price</th><th class="p-4">Status</th><th class="p-4">Views</th><th class="p-4">Leads</th><th class="p-4">Actions</th></tr>
                    </thead>
                    <tbody>
                      @for (car of filteredCars(); track car.id) {
                        <tr class="border-t border-black/5">
                          <td class="p-4">
                            <div class="flex items-center gap-3">
                              <img [src]="car.images[0].url" alt="" class="h-14 w-20 rounded-lg object-cover">
                              <div><p class="font-black">{{ car.year }} {{ car.make }} {{ car.model }}</p><p class="text-xs text-gray-500">{{ car.trim }}</p></div>
                            </div>
                          </td>
                          <td class="p-4 font-black text-[var(--accent)]">{{ car.priceLak | lak }}</td>
                          <td class="p-4"><span class="rounded-full px-3 py-1 text-xs font-black" [class.bg-green-50]="car.isFeatured" [class.text-green-700]="car.isFeatured" [class.bg-gray-100]="!car.isFeatured">{{ car.isFeatured ? 'Featured' : 'Published' }}</span></td>
                          <td class="p-4">{{ car.viewCount }}</td>
                          <td class="p-4">{{ car.clickCount }}</td>
                          <td class="p-4"><button class="rounded-lg bg-gray-100 px-3 py-2 font-bold hover:bg-gray-200" (click)="openEditModal(car)">Edit</button><button class="ml-2 rounded-lg bg-red-100 px-3 py-2 font-bold text-red-800 hover:bg-red-200" (click)="deleteCar(car.id)">Delete</button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </section>
            }

            @if (activeTab() === 'leads') {
              <section class="mt-6 rounded-2xl bg-white shadow-sm">
                <div class="border-b border-black/10 p-5"><h3 class="text-xl font-black">Lead Inbox</h3><p class="text-sm text-gray-500">Contact leads quickly before they go cold.</p></div>
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[760px] text-left text-sm">
                    <thead class="bg-gray-50 text-xs uppercase text-gray-500"><tr><th class="p-4">Customer</th><th class="p-4">Car</th><th class="p-4">Source</th><th class="p-4">Status</th><th class="p-4">Action</th></tr></thead>
                    <tbody>
                      @for (lead of leadRows(); track lead.id) {
                        <tr class="border-t border-black/5"><td class="p-4"><b>{{ lead.name }}</b><p class="text-gray-500">{{ lead.phone }}</p></td><td class="p-4">{{ lead.car?.make || 'General' }} {{ lead.car?.model || '' }}</td><td class="p-4">{{ lead.source }}</td><td class="p-4"><span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{{ lead.status }}</span></td><td class="p-4"><a [href]="'tel:' + lead.phone" class="rounded-lg bg-[var(--accent)] px-3 py-2 font-black text-black">Call</a></td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </section>
            }

            @if (activeTab() === 'bookings') {
              <section class="mt-6 rounded-2xl bg-white shadow-sm">
                <div class="border-b border-black/10 p-5"><h3 class="text-xl font-black">Test Drive Bookings</h3><p class="text-sm text-gray-500">Confirm appointments and prepare vehicles.</p></div>
                <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                  @for (booking of bookingRows(); track booking.id) {
                    <div class="rounded-2xl border border-black/10 p-4">
                      <div class="flex justify-between gap-3"><div><h4 class="font-black">{{ booking.name }}</h4><p class="text-sm text-gray-500">{{ booking.phone }}</p></div><span class="h-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-800">{{ booking.status }}</span></div>
                      <p class="mt-4 font-bold">{{ booking.car?.make || 'Selected car' }} {{ booking.car?.model || '' }}</p>
                      <p class="text-sm text-gray-500">{{ booking.preferredAt | date: 'medium' }}</p>
                      <div class="mt-4 grid grid-cols-2 gap-2"><button class="rounded-lg bg-green-600 px-3 py-2 font-bold text-white">Confirm</button><button class="rounded-lg bg-gray-100 px-3 py-2 font-bold">Reschedule</button></div>
                    </div>
                  }
                </div>
              </section>
            }

            @if (activeTab() === 'settings') {
              <section class="mt-6 grid gap-6 xl:grid-cols-2">
                <div class="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 class="text-xl font-black">Dealer Profile</h3>
                  <div class="mt-4 grid gap-4">
                    <input class="form-input" value="LAOS AUTO">
                    <input class="form-input" value="+8562012345678">
                    <input class="form-input" value="Samsenthai Road, Vientiane">
                    <button class="btn btn-primary w-fit">Save Changes</button>
                  </div>
                </div>
                <div class="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 class="text-xl font-black">Subscription</h3>
                  <p class="mt-2 text-gray-500">Pro Dealer plan renews in 18 days.</p>
                  <button class="btn btn-dark mt-5">Upgrade to Premium</button>
                </div>
              </section>
            }
          </div>
        </section>
      </div>

      @if (isCarModalOpen()) {
        <div class="fixed inset-0 z-[2000] grid place-items-center bg-black/60 p-4">
          <div class="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-black">{{ editingCarId() ? 'Edit Car' : 'Add New Car' }}</h3>
              <button class="text-2xl" (click)="isCarModalOpen.set(false)">×</button>
            </div>
            <form [formGroup]="carForm" (ngSubmit)="saveCar()" class="mt-5 grid gap-3 md:grid-cols-2">
              <input formControlName="make" class="form-input" placeholder="Make (e.g. Toyota)">
              <input formControlName="model" class="form-input" placeholder="Model (e.g. Fortuner)">
              <input formControlName="trim" class="form-input md:col-span-2" placeholder="Trim (e.g. 2.4 Legender)">
              <input formControlName="year" type="number" class="form-input" placeholder="Year">
              <input formControlName="priceLak" class="form-input" placeholder="Price LAK">
              <input formControlName="imageUrl" class="form-input md:col-span-2" placeholder="Image URL">
              <textarea formControlName="description" class="form-input md:col-span-2 min-h-28" placeholder="Description"></textarea>
              <div class="md:col-span-2 mt-2 flex justify-end gap-2">
                <button type="button" class="btn btn-dark" (click)="isCarModalOpen.set(false)">Cancel</button>
                <button type="submit" [disabled]="carForm.invalid" class="btn btn-primary disabled:opacity-50">Save Car</button>
              </div>
            </form>
          </div>
        </div>
      }
    </main>
  `
})
export class DealerDashboardComponent implements OnInit {
  activeTab = signal('overview');
  isCarModalOpen = signal(false);
  editingCarId = signal<string | null>(null);
  carForm: FormGroup;
  cars = signal<Car[]>(publicDemoCars);
  leads = signal<unknown[]>([]);
  bookings = signal<unknown[]>([]);
  inventorySearch = '';

  nav = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'inventory', icon: '🚗', label: 'Inventory' },
    { id: 'leads', icon: '📞', label: 'Leads' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'settings', icon: '⚙', label: 'Settings' }
  ];

  views = computed(() => this.cars().reduce((sum, car) => sum + car.viewCount, 0));
  clicks = computed(() => this.cars().reduce((sum, car) => sum + car.clickCount, 0));
  conversion = computed(() => this.views() ? Math.round((this.clicks() / this.views()) * 100) : 0);

  metrics = computed(() => [
    { label: 'Cars Listed', value: this.cars().length, icon: '🚗', note: '+3 this week', good: true },
    { label: 'Inventory Views', value: this.views().toLocaleString(), icon: '👁', note: '+18% vs last week', good: true },
    { label: 'New Leads', value: this.leadRows().length, icon: '📞', note: 'Needs follow-up', good: false },
    { label: 'Conversion Rate', value: `${this.conversion()}%`, icon: '📈', note: 'Healthy funnel', good: true }
  ]);

  funnel = computed(() => [
    { label: 'Views', value: this.views(), percent: 100 },
    { label: 'Clicks', value: this.clicks(), percent: Math.min(this.conversion(), 100) },
    { label: 'Leads', value: this.leadRows().length, percent: Math.min(this.leadRows().length * 12, 100) },
    { label: 'Bookings', value: this.bookingRows().length, percent: Math.min(this.bookingRows().length * 14, 100) }
  ]);

  filteredCars = computed(() => {
    const q = this.inventorySearch.toLowerCase().trim();
    if (!q) return this.cars();
    return this.cars().filter((car) => `${car.make} ${car.model} ${car.trim}`.toLowerCase().includes(q));
  });

  leadRows = computed<LeadRow[]>(() => {
    const rows = this.leads() as LeadRow[];
    return rows.length ? rows : [
      { id: 'lead-1', name: 'Somphone', phone: '020 5555 1111', source: 'WhatsApp', status: 'new', car: { make: 'Toyota', model: 'Fortuner' }, createdAt: new Date().toISOString() },
      { id: 'lead-2', name: 'Chanthaly', phone: '020 5555 2222', source: 'Test Drive', status: 'contacted', car: { make: 'BYD', model: 'Atto 3' }, createdAt: new Date().toISOString() },
      { id: 'lead-3', name: 'Bounmy', phone: '020 5555 3333', source: 'Messenger', status: 'qualified', car: { make: 'Ford', model: 'Ranger' }, createdAt: new Date().toISOString() }
    ];
  });

  bookingRows = computed<BookingRow[]>(() => {
    const rows = this.bookings() as BookingRow[];
    return rows.length ? rows : [
      { id: 'booking-1', name: 'Kengkao', phone: '020 7777 1111', status: 'requested', preferredAt: new Date().toISOString(), car: { make: 'Honda', model: 'Civic' } },
      { id: 'booking-2', name: 'Sengchan', phone: '020 7777 2222', status: 'confirmed', preferredAt: new Date(Date.now() + 86400000).toISOString(), car: { make: 'Toyota', model: 'Fortuner' } }
    ];
  });

  constructor(private readonly api: ApiService, private readonly fb: FormBuilder) {
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      trim: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      priceLak: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['']
    });
  }

  openCreateModal() {
    this.editingCarId.set(null);
    this.carForm.reset({ year: new Date().getFullYear() });
    this.isCarModalOpen.set(true);
  }

  openEditModal(car: Car) {
    this.editingCarId.set(car.id);
    this.carForm.patchValue({
      make: car.make,
      model: car.model,
      trim: car.trim,
      year: car.year,
      priceLak: car.priceLak,
      imageUrl: car.images && car.images.length > 0 ? car.images[0].url : '',
      description: car.description
    });
    this.isCarModalOpen.set(true);
  }

  saveCar() {
    if (this.carForm.invalid) return;
    const formValue = this.carForm.value;
    const dto = {
      ...formValue,
      images: [{ url: formValue.imageUrl, isPrimary: true }]
    };
    
    const id = this.editingCarId();
    const request = id ? this.api.updateCar(id, dto) : this.api.createCar(dto);
    
    request.subscribe({
      next: () => {
        this.isCarModalOpen.set(false);
        this.loadCars();
      },
      error: (err) => console.error('Save failed', err)
    });
  }

  deleteCar(id: string) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    this.api.deleteCar(id).subscribe({
      next: () => {
        this.cars.set(this.cars().filter(c => c.id !== id));
      },
      error: (err) => console.error('Delete failed', err)
    });
  }

  loadCars() {
    this.api.dealerCars().pipe(catchError(() => of([] as Car[]))).subscribe(cars => {
      if (cars.length) this.cars.set(cars);
    });
  }

  ngOnInit() {
    this.loadCars();
    forkJoin({
      leads: this.api.dealerLeads().pipe(catchError(() => of([]))),
      bookings: this.api.dealerBookings().pipe(catchError(() => of([])))
    }).subscribe(({ leads, bookings }) => {
      this.leads.set(leads);
      this.bookings.set(bookings);
    });
  }
}

