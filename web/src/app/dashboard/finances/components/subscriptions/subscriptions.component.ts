import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription as RxSubscription } from 'rxjs';
import { Subscription } from '../../core/models/database/Susbcription.model';
import { Category } from '../../core/models/database/Category.model';
import { SubscriptionModalService } from './modal/service/subscription-modal.service';
import { FinancesService } from '../../core/services/finances.service';


@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subscriptions-container">
      @if (subscriptions.length === 0) {
        <div class="empty-state">
          <i class="fa-solid fa-calendar-xmark empty-icon"></i>
          <h3>No Active Subscriptions</h3>
          <p>Add your first subscription to start tracking your recurring payments</p>
        </div>
      } @else {
        <div class="subscriptions-grid">
          @for (subscription of subscriptions; track subscription.id) {
            <div class="subscription-card" [style.border-left-color]="subscription.color">
              <div class="subscription-header">
                <div class="subscription-icon" [style.background-color]="subscription.color + '20'">
                  <i class="fa-brands {{ subscription.icon }}" [style.color]="subscription.color"></i>
                </div>
                <div class="subscription-info">
                  <h4>{{ subscription.name }}</h4>
                  <span class="category">{{ subscription.category.name }}</span>
                </div>
                <div class="subscription-status">
                  <span class="status-badge" [class.active]="subscription.isActive" [class.inactive]="!subscription.isActive">
                    {{ subscription.isActive ? 'Active' : 'Paused' }}
                  </span>
                </div>
              </div>
              
              <div class="subscription-details">
                <div class="amount">
                  <span class="price">{{ subscription.currency }}{{ subscription.price }}</span>
                  <span class="cycle">/ {{ subscription.billingCycle }}</span>
                </div>
                <div class="next-payment">
                  <i class="fa-solid fa-calendar-days"></i>
                  <span>Next: {{ formatDate(subscription.renewalDate.toString()) }}</span>
                </div>
              </div>

              <div class="subscription-actions">
                <button class="action-btn" (click)="editSubscription(subscription.id)" title="Edit">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="action-btn" (click)="toggleSubscription(subscription.id)" 
                        [title]="subscription.isActive ? 'Pause' : 'Resume'">
                  <i class="fa-solid" [class.fa-pause]="subscription.isActive" [class.fa-play]="!subscription.isActive"></i>
                </button>
                <button class="action-btn danger" (click)="deleteSubscription(subscription.id)" title="Delete">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          }
        </div>
        
        <div class="subscriptions-summary">
          <div class="summary-card">
            <div class="summary-item">
              <span class="label">Total Monthly</span>
              <span class="value">{{ currency }}{{ getTotalMonthly() }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Active Subscriptions</span>
              <span class="value">{{ getActiveCount() }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Next Payment</span>
              <span class="value">{{ getNextPaymentDate() }}</span>
            </div>
          </div>
        </div>
      }
      
      <!-- Floating Add Button (Alternative) -->
      @if (subscriptions.length > 0) {
        <button class="btn-floating-add" (click)="showAddForm()" title="Add Subscription">
          <i class="fa-solid fa-plus"></i>
        </button>
      }
      
    </div>
  `,
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
  public currency = '$';
  
  private formSubmitSubscription?: RxSubscription;
  
  public subscriptions: Subscription[] = [];

  ngOnInit(): void {
    // Initialize component
    this.loadSubscriptions();
    
    // Subscribe to form submissions from the service
    this.formSubmitSubscription = this.subscriptionModalService.formSubmit$.subscribe(
      (subscription: Subscription) => {
        this.handleSaveSubscription(subscription);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.formSubmitSubscription) {
      this.formSubmitSubscription.unsubscribe();
    }
  }

  constructor(
    private financesService: FinancesService,
    private subscriptionModalService: SubscriptionModalService
  ) {}

  private loadSubscriptions(): void {
    // In a real app, this would fetch data from a service
    this.financesService.getSubscriptions().subscribe({
      next: (response) => {
        if (response.success) {
          this.subscriptions = response.data as Subscription[];
        }
      }
    });
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  public getTotalMonthly(): number {
    return this.subscriptions
      .filter(sub => sub.isActive)
      .reduce((total, sub) => {
        // Convert all billing cycles to monthly equivalent
        let monthlyAmount = sub.price;
        switch (sub.billingCycle) {
          case 'yearly':
            monthlyAmount = sub.price / 12;
            break;
          case 'weekly':
            monthlyAmount = sub.price * 4.33; // Average weeks per month
            break;
          case 'daily':
            monthlyAmount = sub.price * 30; // Average days per month
            break;
        }
        return total + monthlyAmount;
      }, 0);
  }

  public getActiveCount(): number {
    return this.subscriptions.filter(sub => sub.isActive).length;
  }

  public getNextPaymentDate(): string {
    const activeSubs = this.subscriptions.filter(sub => sub.isActive);
    if (activeSubs.length === 0) return 'N/A';
    
    const nextPayment = activeSubs
      .map(sub => new Date(sub.renewalDate))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric'
    };
    return nextPayment.toLocaleDateString('en-US', options);
  }

  public showAddForm(): void {
    this.subscriptionModalService.openCreateModal();
  }

  public editSubscription(id: number): void {
    const subscription = this.subscriptions.find(sub => sub.id === id);
    if (subscription) {
      this.subscriptionModalService.openEditModal(subscription);
    }
  }

  public toggleSubscription(id: number): void {
    const subscription = this.subscriptions.find(sub => sub.id === id);
    if (subscription) {
      subscription.isActive = !subscription.isActive;
    }
  }

  public deleteSubscription(id: number): void {
    this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
  }

  public handleSaveSubscription(subscription: Subscription): void {
    const existingIndex = this.subscriptions.findIndex(sub => sub.id === subscription.id);
    
    if (existingIndex !== -1) {
      // Update existing subscription
      this.subscriptions[existingIndex] = subscription;
    } else {
      // Add new subscription
      this.subscriptions.push(subscription);
    }
    
    // Sort subscriptions by name for better organization
    this.subscriptions.sort((a, b) => a.name.localeCompare(b.name));
  }
}