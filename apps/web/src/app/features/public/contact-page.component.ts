import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="la-page-offset min-h-screen bg-[var(--gray-100)]">
      <section class="bg-[var(--primary)] py-12 text-center text-white">
        <div class="la-container">
          <h1 class="text-4xl font-black">ຕິດຕໍ່ພວກເຮົາ</h1>
          <p class="mt-2 text-gray-400">Ready to serve you anytime.</p>
        </div>
      </section>

      <section class="la-container py-10">
        <div class="contact-content !grid-cols-1 md:!grid-cols-2">
          <div class="contact-card">
            @if (!sent()) {
              <h2 class="mb-6 text-2xl font-black">📝 Send Us a Message</h2>
              <form (ngSubmit)="submit()" class="grid gap-4">
                <label class="font-bold">Full Name <input [(ngModel)]="form.name" name="name" required class="form-input mt-2" placeholder="Somphone Xayyasith"></label>
                <label class="font-bold">Phone Number <input [(ngModel)]="form.phone" name="phone" required class="form-input mt-2" placeholder="020 XXXX XXXX"></label>
                <label class="font-bold">Interested In
                  <select [(ngModel)]="form.interest" name="interest" class="form-input mt-2">
                    <option value="new-car">New Car</option>
                    <option value="used-car">Used Car</option>
                    <option value="test-drive">Test Drive</option>
                    <option value="financing">Financing</option>
                  </select>
                </label>
                <label class="font-bold">Message <textarea [(ngModel)]="form.message" name="message" class="form-input mt-2 min-h-28" placeholder="Tell us what you need..."></textarea></label>
                <button class="btn btn-primary w-full">📤 Send Message</button>
              </form>
            } @else {
              <div class="py-12 text-center">
                <div class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--success)] text-4xl text-white">✓</div>
                <h2 class="mt-5 text-2xl font-black">Message Sent!</h2>
                <p class="text-gray-500">We will contact you soon.</p>
                <button class="btn btn-primary mt-6" (click)="sent.set(false)">Send Another</button>
              </div>
            }
          </div>

          <div class="grid gap-4">
            <div class="contact-card !rounded-2xl !p-5"><h3 class="font-black">📞 Call Us</h3><a href="tel:+8562012345678" class="mt-1 block text-[var(--accent)] font-black">020 1234 5678</a></div>
            <div class="contact-card !rounded-2xl !p-5"><h3 class="font-black">💬 WhatsApp</h3><a href="https://wa.me/8562012345678" class="mt-1 block text-[var(--accent)] font-black">020 1234 5678</a><p class="text-sm text-gray-500">Quick response 24/7</p></div>
            <div class="contact-card !rounded-2xl !p-5"><h3 class="font-black">📘 Facebook Messenger</h3><a href="https://m.me/laosauto" class="mt-1 block text-[var(--accent)] font-black">LAOS AUTO</a></div>
            <div class="contact-card !rounded-2xl !p-5"><h3 class="font-black">📍 Address</h3><p class="text-gray-600">Samsenthai Road, Vientiane Capital</p></div>
            <div class="contact-card !rounded-2xl !p-5"><h3 class="font-black">Opening Hours</h3><p class="mt-2 flex justify-between"><span>Mon - Fri</span><b>08:00 - 17:30</b></p><p class="flex justify-between"><span>Saturday</span><b>08:00 - 12:00</b></p><p class="flex justify-between"><span>Sunday</span><b class="text-red-500">Closed</b></p></div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class ContactPageComponent {
  sent = signal(false);
  form = { name: '', phone: '', interest: 'new-car', message: '' };

  constructor(private readonly api: ApiService) {}

  submit() {
    this.api.createLead({ tenantId: 'demo-tenant', name: this.form.name, phone: this.form.phone, source: this.form.interest, message: this.form.message }).subscribe({
      next: () => this.sent.set(true),
      error: () => this.sent.set(true)
    });
  }
}

