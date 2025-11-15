import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginForm: FormGroup;
  public isLoading = false;
  public showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const { email, password } = this.loginForm.value;
      
      try {
        const success = await this.authService.login(email, password);
        
        if (success) {
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Handle login failure
          console.error('Login failed');
          // You can add error handling here (show toast, etc.)
        }
      } catch (error) {
        console.error('Login error:', error);
        // Handle error
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  public getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }
}
