import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Check if user has a valid authentication token
   */
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get current user from localStorage
   */
  private getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Login user with email and password
   */
  public login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, accept any valid input
        if (email && password.length >= 6) {
          const user: User = { email, name: 'User' };
          const token = 'demo-token-' + Date.now();
          
          // Store authentication data
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update subjects
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1500);
    });
  }

  /**
   * Logout user
   */
  public logout(): void {
    // Clear stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Update subjects
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is currently authenticated
   */
  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  public getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get auth token
   */
  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
