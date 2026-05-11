import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { Car, Tenant } from '../../core/models';
import { publicDemoCars } from '../../core/public-cars';
import { LakCurrencyPipe } from '../../shared/currency.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LakCurrencyPipe],
  template: `
    <main class="min-h-screen bg-[#eef1f5] pt-[72px]">
      <div class="grid min-h-[calc(100vh-72px)] xl:grid-cols-[290px_1fr]">
        <aside class="hidden bg-[#08090b] text-white xl:block">
          <div class="border-b border-white/10 p-6">
            <p class="text-xs font-black uppercase tracking-[0.25em] text-[var(--accent)]">Super Admin</p>
            <h1 class="mt-2 text-2xl font-black">Platform Cpanel</h1>
          </div>
          <nav class="grid gap-1 p-3 text-sm font-bold">
            @for (item of nav; track item.id) {
              <button class="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-white/10" [class.bg-[var(--accent)]]="activeTab() === item.id" [class.text-black]="activeTab() === item.id" (click)="activeTab.set(item.id)">
                <span>{{ item.icon }}</span>{{ item.label }}
              </button>
            }
          </nav>
          <div class="m-4 rounded-2xl bg-white/10 p-4">
            <p class="text-sm font-black">Platform Health</p>
            <p class="mt-1 text-3xl font-black text-green-400">99.9%</p>
            <p class="text-xs text-gray-300">API, Postgres, notifications online</p>
          </div>
        </aside>

        <section class="min-w-0">
          <header class="sticky top-[72px] z-30 border-b border-black/10 bg-white/95 backdrop-blur">
            <div class="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between lg:px-8">
              <div>
                <p class="text-sm font-black text-[var(--accent)]">Platform Owner</p>
                <h2 class="text-2xl font-black text-gray-950">Tenants, listings, subscriptions, analytics</h2>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="btn btn-dark !min-h-10 !px-4" (click)="activeTab.set('moderation')">Review Listings</button>
                <button class="btn btn-primary !min-h-10 !px-4" (click)="openTenantModal()">+ Add Tenant</button>
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
                  <p class="mt-1 text-xs font-bold text-green-600">{{ metric.note }}</p>
                </div>
              }
            </section>

            @if (activeTab() === 'overview') {
              <section class="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
                <div class="rounded-2xl bg-white p-5 shadow-sm">
                  <div class="mb-4 flex items-center justify-between">
                    <h3 class="text-xl font-black">Platform Analytics</h3>
                    <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Today</span>
                  </div>
                  <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-2xl bg-gray-50 p-5"><p class="text-sm text-gray-500">Visitors</p><p class="text-3xl font-black">12.4k</p><div class="mt-4 h-2 rounded-full bg-gray-200"><div class="h-2 w-4/5 rounded-full bg-[var(--accent)]"></div></div></div>
                    <div class="rounded-2xl bg-gray-50 p-5"><p class="text-sm text-gray-500">Leads</p><p class="text-3xl font-black">348</p><div class="mt-4 h-2 rounded-full bg-gray-200"><div class="h-2 w-3/5 rounded-full bg-green-500"></div></div></div>
                    <div class="rounded-2xl bg-gray-50 p-5"><p class="text-sm text-gray-500">Bookings</p><p class="text-3xl font-black">91</p><div class="mt-4 h-2 rounded-full bg-gray-200"><div class="h-2 w-2/5 rounded-full bg-blue-500"></div></div></div>
                  </div>
                  <div class="mt-6 rounded-2xl bg-[#101216] p-5 text-white">
                    <h4 class="font-black">Growth Notes</h4>
                    <p class="mt-2 text-sm text-gray-300">Premium featured listings are driving the strongest click-through rate. Push top-performing SUV inventory into homepage placements.</p>
                  </div>
                </div>

                <div class="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 class="text-xl font-black">Monetization Snapshot</h3>
                  <div class="mt-4 grid gap-3">
                    @for (plan of plans; track plan.name) {
                      <div class="flex items-center justify-between rounded-xl border border-black/10 p-4">
                        <div><p class="font-black">{{ plan.name }}</p><p class="text-xs text-gray-500">{{ plan.tenants }} tenants</p></div>
                        <p class="font-black text-[var(--accent)]">{{ plan.revenue | lak }}</p>
                      </div>
                    }
                  </div>
                </div>
              </section>
            }

            @if (activeTab() === 'tenants') {
              <section class="mt-6 rounded-2xl bg-white shadow-sm">
                <div class="flex flex-col gap-3 border-b border-black/10 p-5 md:flex-row md:items-center md:justify-between">
                  <div><h3 class="text-xl font-black">Tenant Management</h3><p class="text-sm text-gray-500">Approve dealers, manage plans, and monitor activity.</p></div>
                  <input [(ngModel)]="tenantSearch" class="form-input max-w-sm" placeholder="Search tenants">
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[900px] text-left text-sm">
                    <thead class="bg-gray-50 text-xs uppercase text-gray-500"><tr><th class="p-4">Dealer</th><th class="p-4">Plan</th><th class="p-4">Listings</th><th class="p-4">Leads</th><th class="p-4">Status</th><th class="p-4">Actions</th></tr></thead>
                    <tbody>
                      @for (tenant of tenantRows(); track tenant.id) {
                        <tr class="border-t border-black/5">
                          <td class="p-4"><b>{{ tenant.name }}</b><p class="text-gray-500">{{ tenant.address || tenant.slug }}</p></td>
                          <td class="p-4"><span class="rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-800">{{ tenant.plan }}</span></td>
                          <td class="p-4">{{ tenant.listings }}</td>
                          <td class="p-4">{{ tenant.leads }}</td>
                          <td class="p-4"><span class="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Active</span></td>
                          <td class="p-4"><button class="rounded-lg bg-gray-100 px-3 py-2 font-bold hover:bg-gray-200" (click)="openEditTenantModal(tenant)">Edit</button><button class="ml-2 rounded-lg bg-red-100 px-3 py-2 font-bold text-red-800 hover:bg-red-200" (click)="deleteTenant(tenant.id)">Delete</button></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </section>
            }

            @if (activeTab() === 'moderation') {
              <section class="mt-6 rounded-2xl bg-white shadow-sm">
                <div class="border-b border-black/10 p-5"><h3 class="text-xl font-black">Listing Moderation</h3><p class="text-sm text-gray-500">Approve, reject, feature, or flag dealer inventory.</p></div>
                <div class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                  @for (car of cars(); track car.id) {
                    <div class="overflow-hidden rounded-2xl border border-black/10">
                      <img [src]="car.images[0].url" alt="" class="h-44 w-full object-cover">
                      <div class="p-4">
                        <div class="flex justify-between gap-3"><div><h4 class="font-black">{{ car.year }} {{ car.make }} {{ car.model }}</h4><p class="text-sm text-gray-500">{{ car.tenant?.name || 'Dealer' }}</p></div><span class="h-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Pending</span></div>
                        <p class="mt-3 font-black text-[var(--accent)]">{{ car.priceLak | lak }}</p>
                        <div class="mt-4 flex flex-wrap gap-2">
                          <button class="rounded-lg bg-green-600 px-3 py-2 font-bold text-white">Approve</button>
                          <button class="rounded-lg bg-yellow-100 px-3 py-2 font-bold text-yellow-800">Feature</button>
                          <button class="rounded-lg bg-red-50 px-3 py-2 font-bold text-red-700" (click)="deleteCar(car.id)">Delete</button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </section>
            }

            @if (activeTab() === 'billing') {
              <section class="mt-6 grid gap-6 xl:grid-cols-3">
                @for (plan of plans; track plan.name) {
                  <div class="rounded-2xl bg-white p-6 shadow-sm">
                    <p class="text-sm font-black text-[var(--accent)]">{{ plan.name }}</p>
                    <p class="mt-3 text-4xl font-black">{{ plan.price | lak }}</p>
                    <p class="mt-2 text-sm text-gray-500">{{ plan.limit }} listings · {{ plan.tenants }} tenants</p>
                    <button class="btn btn-dark mt-6 w-full">Edit Plan</button>
                  </div>
                }
              </section>
            }

            @if (activeTab() === 'ads') {
              <section class="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
                <div class="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 class="text-xl font-black">Banner Ads & Featured Placement</h3>
                  <div class="mt-5 grid gap-4">
                    @for (ad of ads; track ad.name) {
                      <div class="flex flex-col gap-3 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center md:justify-between">
                        <div><p class="font-black">{{ ad.name }}</p><p class="text-sm text-gray-500">{{ ad.slot }} · {{ ad.status }}</p></div>
                        <button class="rounded-lg bg-[var(--accent)] px-4 py-2 font-black">Manage</button>
                      </div>
                    }
                  </div>
                </div>
                <div class="rounded-2xl bg-[#101216] p-5 text-white shadow-sm">
                  <h3 class="text-xl font-black">Revenue Ideas</h3>
                  <p class="mt-3 text-sm text-gray-300">Sell homepage hero placements, featured car boosts, dealer profile banners, and pay-per-lead packages.</p>
                </div>
              </section>
            }

            @if (activeTab() === 'settings') {
              <section class="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                <h3 class="text-xl font-black">Platform Settings</h3>
                <div class="mt-5 grid gap-4 md:grid-cols-2">
                  <input class="form-input" value="LAOS AUTO SaaS">
                  <input class="form-input" value="support@laosauto.la">
                  <input class="form-input" value="LAK">
                  <input class="form-input" value="Lao, English">
                </div>
                <button class="btn btn-primary mt-5">Save Settings</button>
              </section>
            }
          </div>
        </section>
      </div>

      @if (isTenantModalOpen()) {
        <div class="fixed inset-0 z-[2000] grid place-items-center bg-black/60 p-4">
          <div class="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-black">{{ editingTenantId() ? 'Edit Tenant' : 'Add Tenant' }}</h3>
              <button class="text-2xl" (click)="isTenantModalOpen.set(false)">×</button>
            </div>
            <form [formGroup]="tenantForm" (ngSubmit)="saveTenant()" class="mt-5 grid gap-3">
              <input formControlName="name" class="form-input" placeholder="Dealer name">
              <input formControlName="slug" class="form-input" placeholder="dealer-slug">
              <input formControlName="phone" class="form-input" placeholder="Phone">
              <input formControlName="address" class="form-input" placeholder="Address">
              <div class="mt-2 flex justify-end gap-2">
                <button type="button" class="btn btn-dark" (click)="isTenantModalOpen.set(false)">Cancel</button>
                <button type="submit" [disabled]="tenantForm.invalid" class="btn btn-primary disabled:opacity-50">Save Tenant</button>
              </div>
            </form>
          </div>
        </div>
      }
    </main>
  `
})
export class SuperAdminDashboardComponent implements OnInit {
  activeTab = signal('overview');
  isTenantModalOpen = signal(false);
  editingTenantId = signal<string | null>(null);
  tenantForm: FormGroup;
  tenantSearch = '';
  cars = signal<Car[]>(publicDemoCars);
  tenants = signal<Tenant[]>([]);

  nav = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'tenants', icon: '🏢', label: 'Tenants' },
    { id: 'moderation', icon: '✅', label: 'Listing Review' },
    { id: 'billing', icon: '💳', label: 'Subscriptions' },
    { id: 'ads', icon: '📣', label: 'Ads & Boosts' },
    { id: 'settings', icon: '⚙', label: 'Settings' }
  ];

  plans = [
    { name: 'Free', price: 0, revenue: 0, limit: 5, tenants: 18 },
    { name: 'Pro', price: 950000, revenue: 14250000, limit: 50, tenants: 15 },
    { name: 'Premium', price: 2500000, revenue: 22500000, limit: 200, tenants: 9 }
  ];

  ads = [
    { name: 'Homepage Hero Banner', slot: 'Top placement', status: '2 active campaigns' },
    { name: 'Featured Car Boost', slot: 'Listings priority', status: '14 boosted cars' },
    { name: 'Dealer Profile Banner', slot: 'Dealer pages', status: '5 active banners' }
  ];

  tenantRows = computed(() => {
    const base = this.tenants().length ? this.tenants() : [
      { id: 't1', name: 'LAOS AUTO Vientiane', slug: 'laos-auto', address: 'Vientiane', phone: '+8562012345678' },
      { id: 't2', name: 'Mekong Motors', slug: 'mekong-motors', address: 'Savannakhet', phone: '+8562099991111' },
      { id: 't3', name: 'North Auto Group', slug: 'north-auto', address: 'Luang Prabang', phone: '+8562099992222' }
    ] as Tenant[];
    const q = this.tenantSearch.toLowerCase().trim();
    return base
      .filter((tenant) => !q || `${tenant.name} ${tenant.slug}`.toLowerCase().includes(q))
      .map((tenant, index) => ({ ...tenant, plan: index === 0 ? 'Premium' : index === 1 ? 'Pro' : 'Free', listings: 24 - index * 7, leads: 86 - index * 18 }));
  });

  metrics = computed(() => [
    { label: 'Tenants', value: this.tenantRows().length, icon: '🏢', note: '+2 this month' },
    { label: 'MRR', value: '₭36.7M', icon: '💰', note: '+14% growth' },
    { label: 'Listings', value: this.cars().length, icon: '🚗', note: '8 pending review' },
    { label: 'Conversion', value: '7.8%', icon: '📈', note: 'Strong lead flow' }
  ]);

  constructor(private readonly api: ApiService, private readonly fb: FormBuilder) {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      phone: [''],
      address: ['']
    });
  }

  openTenantModal() {
    this.editingTenantId.set(null);
    this.tenantForm.reset();
    this.isTenantModalOpen.set(true);
  }

  openEditTenantModal(tenant: Tenant) {
    this.editingTenantId.set(tenant.id);
    this.tenantForm.patchValue({
      name: tenant.name,
      slug: tenant.slug,
      phone: tenant.phone,
      address: tenant.address
    });
    this.isTenantModalOpen.set(true);
  }

  saveTenant() {
    if (this.tenantForm.invalid) return;
    const dto = this.tenantForm.value;
    const id = this.editingTenantId();
    const request = id ? this.api.updateDealer(id, dto) : this.api.createDealer(dto);
    
    request.subscribe({
      next: () => {
        this.isTenantModalOpen.set(false);
        this.loadDealers();
      },
      error: (err) => console.error('Failed to save tenant', err)
    });
  }

  deleteTenant(id: string) {
    if (!confirm('Are you sure you want to delete this dealer? All their cars and users will be deleted.')) return;
    this.api.deleteDealer(id).subscribe({
      next: () => {
        this.tenants.set(this.tenants().filter(t => t.id !== id));
      },
      error: (err) => console.error('Failed to delete tenant', err)
    });
  }

  deleteCar(id: string) {
    if (!confirm('Are you sure you want to completely remove this car from the platform?')) return;
    this.api.deleteCar(id).subscribe({
      next: () => {
        this.cars.set(this.cars().filter(c => c.id !== id));
      },
      error: (err) => console.error('Failed to delete car', err)
    });
  }

  loadDealers() {
    this.api.dealers().pipe(catchError(() => of([] as Tenant[]))).subscribe(dealers => {
      if (dealers.length) this.tenants.set(dealers);
    });
  }

  ngOnInit() {
    this.loadDealers();
    forkJoin({
      cars: this.api.cars({ limit: 48 }).pipe(catchError(() => of({ items: [] as Car[], total: 0, page: 1, limit: 48 })))
    }).subscribe(({ cars }) => {
      if (cars.items.length) this.cars.set(cars.items);
    });
  }
}
