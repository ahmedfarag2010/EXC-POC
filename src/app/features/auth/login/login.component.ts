import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      console.log('🔐 [FAKE LOGIN] Attempting login with:', { email, password });

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('✅ [FAKE LOGIN] Login successful:', response);
          this.isLoading = false;
          // Redirect to home page after successful login
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('❌ [FAKE LOGIN] Login failed:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }

  fakeLogin(): void {
    console.log('🚀 [FAKE LOGIN] Using fake login credentials');
    this.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    this.onSubmit();
  }
}
