import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Subscription } from '../../../../core/models/database/Susbcription.model';

export interface SubscriptionModalConfig {
  isVisible: boolean;
  mode: 'create' | 'edit';
  subscription?: Subscription | null;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionModalService {
  
  // BehaviorSubject to manage modal state
  private modalStateSubject = new BehaviorSubject<SubscriptionModalConfig>({
    isVisible: false,
    mode: 'create',
    subscription: null
  });

  // Subject for form submission events
  private formSubmitSubject = new Subject<Subscription>();
  
  // Subject for form close events
  private formCloseSubject = new Subject<void>();

  // Observable streams
  public modalState$ = this.modalStateSubject.asObservable();
  public formSubmit$ = this.formSubmitSubject.asObservable();
  public formClose$ = this.formCloseSubject.asObservable();

  constructor() {}

  /**
   * Open the modal for creating a new subscription
   */
  public openCreateModal(): void {
    console.log("Abriendo modal de creación");
    this.modalStateSubject.next({
      isVisible: true,
      mode: 'create',
      subscription: null
    });
  }

  /**
   * Open the modal for editing an existing subscription
   * @param subscription The subscription to edit
   */
  public openEditModal(subscription: Subscription): void {
    this.modalStateSubject.next({
      isVisible: true,
      mode: 'edit',
      subscription: { ...subscription } // Create a copy to avoid direct mutations
    });
  }

  /**
   * Close the modal
   */
  public closeModal(): void {
    this.modalStateSubject.next({
      isVisible: false,
      mode: 'create',
      subscription: null
    });
    this.formCloseSubject.next();
  }

  /**
   * Handle form submission
   * @param subscription The subscription data from the form
   */
  public handleFormSubmit(subscription: Subscription): void {
    this.formSubmitSubject.next(subscription);
    this.closeModal();
  }

  /**
   * Get current modal state
   */
  public getCurrentModalState(): SubscriptionModalConfig {
    return this.modalStateSubject.value;
  }

  /**
   * Check if modal is currently visible
   */
  public isModalVisible(): boolean {
    return this.modalStateSubject.value.isVisible;
  }

  /**
   * Check if modal is in edit mode
   */
  public isEditMode(): boolean {
    return this.modalStateSubject.value.mode === 'edit';
  }

  /**
   * Get the subscription being edited (if any)
   */
  public getEditingSubscription(): Subscription | null {
    return this.modalStateSubject.value.subscription || null;
  }

  /**
   * Reset the service state (useful for cleanup)
   */
  public reset(): void {
    this.modalStateSubject.next({
      isVisible: false,
      mode: 'create',
      subscription: null
    });
  }
}