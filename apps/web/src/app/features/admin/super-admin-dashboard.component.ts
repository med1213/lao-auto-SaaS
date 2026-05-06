import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="mx-auto max-w-7xl px-4 py-6">
      <p class="font-bold text-forest">Platform owner</p>
      <h1 class="text-3xl font-black">Super Admin Dashboard</h1>
      <section class="mt-6 grid gap-3 md:grid-cols-4">
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Tenants</p><p class="text-3xl font-black">0</p></div>
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">MRR</p><p class="text-3xl font-black">₭0</p></div>
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Pending listings</p><p class="text-3xl font-black">0</p></div>
        <div class="rounded-lg bg-white p-4"><p class="text-sm text-black/50">Conversion rate</p><p class="text-3xl font-black">0%</p></div>
      </section>
      <div class="mt-8 rounded-lg border border-black/10 bg-white p-5">
        <h2 class="text-xl font-black">Monetization controls</h2>
        <p class="mt-1 text-black/60">Subscription plans, featured placement, banner ads, listing approvals, and pay-per-lead billing are modeled in the API and ready for admin screens.</p>
        <a routerLink="/cars" class="mt-4 inline-block rounded-md bg-forest px-5 py-3 font-bold text-white">Review inventory</a>
      </div>
    </main>
  `
})
export class SuperAdminDashboardComponent {}

