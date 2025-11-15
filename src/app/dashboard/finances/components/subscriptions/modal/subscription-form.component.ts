import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription as RxSubscription } from 'rxjs';
import { Subscription } from '../../../core/models/database/Susbcription.model';
import { Category } from '../../../core/models/database/Category.model';
import { SubscriptionModalService, SubscriptionModalConfig } from './service/subscription-modal.service';
import { CreateSubscriptionDto } from '../../../core/dto/subscription/create-subscription.dto';
import { FinancesService } from '../../../core/services/finances.service';


@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Input() subscription: Subscription | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Subscription>();

  public subscriptionForm!: FormGroup;
  public isLoading = false;
  public modalConfig: SubscriptionModalConfig = {
    isVisible: false,
    mode: 'create',
    subscription: null
  };

  private modalStateSubscription?: RxSubscription;
  
  public categories: Category[] = [
    new Category(1, 'Entertainment'),
    new Category(2, 'Productivity'),
    new Category(3, 'Development'),
    new Category(4, 'Education'),
    new Category(5, 'Health & Fitness'),
    new Category(6, 'Finance'),
    new Category(7, 'Utilities'),
    new Category(8, 'Communication'),
    new Category(9, 'Cloud Storage'),
    new Category(10, 'Security')
  ];

  constructor(
    private financesService: FinancesService,
    private formBuilder: FormBuilder,
    private subscriptionModalService: SubscriptionModalService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    // Subscribe to modal state changes from the service
    this.modalStateSubscription = this.subscriptionModalService.modalState$.subscribe(
      (config: SubscriptionModalConfig) => {
        console.log("Se supone que llega hasta aquí");
        this.modalConfig = config;
        if (config.isVisible && config.subscription) {
          this.populateForm(config.subscription);
        } else if (config.isVisible && config.mode === 'create') {
          this.resetForm();
        }
      }
    );

    // Legacy support for direct input properties
    if (this.subscription) {
      this.populateForm(this.subscription);
    }
  }

  ngOnDestroy(): void {
    if (this.modalStateSubscription) {
      this.modalStateSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.subscriptionForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      provider: [''],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      currency: ['$', Validators.required],
      billingCycle: ['', Validators.required],
      startDate: ['', Validators.required],
      renewalDate: ['', Validators.required],
      categoryId: ['', Validators.required],
      website: [''],
      email: ['', Validators.email],
      color: ['#007bff'],
      icon: [''],
      isActive: [true]
    });
  }

  private populateForm(subscription?: Subscription): void {
    const subscriptionToUse = subscription || this.modalConfig.subscription;
    if (subscriptionToUse) {
      this.subscriptionForm.patchValue({
        name: subscriptionToUse.name,
        provider: subscriptionToUse.provider,
        description: subscriptionToUse.description,
        price: subscriptionToUse.price,
        currency: subscriptionToUse.currency,
        billingCycle: subscriptionToUse.billingCycle,
        startDate: this.formatDateForInput(subscriptionToUse.startDate),
        renewalDate: subscriptionToUse.renewalDate,
        categoryId: subscriptionToUse.category.id,
        website: subscriptionToUse.website,
        email: subscriptionToUse.email,
        color: subscriptionToUse.color,
        icon: subscriptionToUse.icon,
        isActive: subscriptionToUse.isActive
      });
    }
  }

  private formatDateForInput(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  }

  public closeForm(): void {
    // Use service to close modal
    this.subscriptionModalService.closeModal();
    
    // Legacy support - emit event for backward compatibility
    this.onClose.emit();
  }

  private resetForm(): void {
    this.subscriptionForm.reset();
    this.subscriptionForm.patchValue({
      currency: '$',
      color: '#007bff',
      isActive: true
    });
    this.subscription = null;
  }

  public async onSubmit(): Promise<void> {
    if (this.subscriptionForm.valid) {
      this.isLoading = true;
      
      try {
        const formValue = this.subscriptionForm.value;
        const selectedCategory = this.categories.find(cat => cat.id === parseInt(formValue.categoryId));
        
        const subscriptionData: CreateSubscriptionDto = {
          name: formValue.name,
          provider: formValue.provider || '',
          price: parseFloat(formValue.price),
          currency: formValue.currency,
          billingCycle: formValue.billingCycle,
          startDate: new Date(formValue.startDate).toISOString(),
          renewalDate: new Date(formValue.renewalDate).toISOString(),
          isActive: formValue.isActive,
          description: formValue.description || '',
          website: formValue.website || '',
          email: formValue.email || '',
          icon: formValue.icon || 'fa-circle',
          color: formValue.color || '#007bff',
          category: selectedCategory?.id || new Category(1, 'Other').id,
        };

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.financesService.createSubscription(subscriptionData).subscribe({
          next: (response) => {
            console.log(response);
            if (response.success) {
              // Use service to handle form submission
              this.subscriptionModalService.handleFormSubmit(response.data);
              
              // Legacy support - emit event for backward compatibility
              this.onSave.emit(response.data);
            }
          },
          error: (error) => {
            console.error('Error creating subscription:', error);
          }
        });

        
      } catch (error) {
        console.error('Error saving subscription:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.subscriptionForm.controls).forEach(key => {
      const control = this.subscriptionForm.get(key);
      control?.markAsTouched();
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.subscriptionForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }

  public getErrorMessage(fieldName: string): string {
    const control = this.subscriptionForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be greater than or equal to ${control.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Service Name',
      provider: 'Provider',
      price: 'Price',
      currency: 'Currency',
      billingCycle: 'Billing Cycle',
      startDate: 'Start Date',
      renewalDate: 'Renewal Date',
      categoryId: 'Category',
      email: 'Email',
      website: 'Website'
    };
    return displayNames[fieldName] || fieldName;
  }
}