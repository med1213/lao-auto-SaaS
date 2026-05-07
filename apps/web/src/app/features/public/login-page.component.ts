import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Lock, LogIn, CarFront, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
      <!-- Background Gradients -->
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="w-full max-w-md p-8 relative z-10">
        <!-- Logo/Icon -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 animate-[pulse_3s_ease-in-out_infinite]">
            <lucide-icon [img]="CarIcon" class="text-white w-8 h-8"></lucide-icon>
          </div>
          <h2 class="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p class="text-gray-400 mt-2">Sign in to your Lao Auto account</p>
        </div>

        <!-- Glassmorphism Card -->
        <div class="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center">
              {{ errorMessage }}
            </div>

            <!-- Email Input -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <lucide-icon [img]="MailIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
                </div>
                <input 
                  type="email" 
                  formControlName="email"
                  class="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-300">Password</label>
                <a href="#" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <lucide-icon [img]="LockIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
                </div>
                <input 
                  type="password" 
                  formControlName="password"
                  class="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-[52px]"
            >
              <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span class="relative flex items-center">
                <ng-container *ngIf="!isLoading">
                  Sign In
                  <lucide-icon [img]="LogInIcon" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"></lucide-icon>
                </ng-container>
                <lucide-icon *ngIf="isLoading" [img]="LoaderIcon" class="w-5 h-5 animate-spin"></lucide-icon>
              </span>
            </button>
          </form>

          <div class="mt-8 text-center">
            <p class="text-sm text-gray-400">
              Don't have an account? 
              <a href="#" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  MailIcon = Mail;
  LockIcon = Lock;
  LogInIcon = LogIn;
  CarIcon = CarFront;
  LoaderIcon = Loader2;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Role-based redirect
        const role = res.user.role;
        if (role === 'super_admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials or server error.';
      }
    });
  }
}
