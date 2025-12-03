import { Component } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../../core/dto/auth/register.dto';

@Component({
    selector: 'app-sign-up',
    imports: [ReactiveFormsModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  public signUpForm: FormGroup;
  public isLoading = false;
  public showPassword = false;
  public showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signUpForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      loginName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Custom validator to check password strength
   */
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    
    if (!password) {
      return null;
    }

    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    
    const valid = hasNumber && hasUpper && hasLower;
    
    if (!valid) {
      return { passwordStrength: true };
    }
    
    return null;
  }

  /**
   * Custom validator to check if passwords match
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }

    return null;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signUpForm.controls).forEach(key => {
      const control = this.signUpForm.get(key);
      control?.markAsTouched();
    });
  }

  public getErrorMessage(fieldName: string): string {
    const control = this.signUpForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern'] && fieldName === 'loginName') {
        return 'Login name can only contain letters, numbers, hyphens, and underscores';
      }
      if (control.errors['passwordStrength']) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      if (control.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Full name',
      loginName: 'Login name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return labels[fieldName] || fieldName;
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.signUpForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }


  public async onSubmit(): Promise<void> {
    if (this.signUpForm.valid) {
      this.isLoading = true;
      
      const { fullName, loginName, email, password } = this.signUpForm.value;
      
      try {
        const registerDto = new RegisterDto({name: fullName, username: loginName, email, password});

        // Call the auth service to register the user
        const success = await this.authService.register(registerDto);
        
        if (success) {
          // Navigate to login or dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Handle registration failure
          console.error('Registration failed');
          // You can add error handling here (show toast, etc.)
        }
      } catch (error) {
        console.error('Registration error:', error);
        // Handle error
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }
}
