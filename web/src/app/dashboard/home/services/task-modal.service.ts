import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Task } from '../core/models/database/Task.model';

export interface TaskModalConfig {
  isVisible: boolean;
  mode: 'create' | 'edit';
  task?: Task | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskModalService {
  
  // BehaviorSubject to manage modal state
  private modalStateSubject = new BehaviorSubject<TaskModalConfig>({
    isVisible: false,
    mode: 'create',
    task: null
  });

  // Subject for form submission events
  private formSubmitSubject = new Subject<Task>();
  
  // Subject for form close events
  private formCloseSubject = new Subject<void>();

  // Observable streams
  public modalState$ = this.modalStateSubject.asObservable();
  public formSubmit$ = this.formSubmitSubject.asObservable();
  public formClose$ = this.formCloseSubject.asObservable();

  constructor() {}

  /**
   * Open the modal for creating a new task
   */
  public openCreateModal(): void {
    this.modalStateSubject.next({
      isVisible: true,
      mode: 'create',
      task: null
    });
  }

  /**
   * Open the modal for editing an existing task
   * @param task The task to edit
   */
  public openEditModal(task: Task): void {
    this.modalStateSubject.next({
      isVisible: true,
      mode: 'edit',
      task: { ...task } // Create a copy to avoid direct mutations
    });
  }

  /**
   * Close the modal
   */
  public closeModal(): void {
    this.modalStateSubject.next({
      isVisible: false,
      mode: 'create',
      task: null
    });
    this.formCloseSubject.next();
  }

  /**
   * Handle form submission
   * @param task The task data from the form
   */
  public handleFormSubmit(task: Task): void {
    this.formSubmitSubject.next(task);
    this.closeModal();
  }

  /**
   * Get current modal state
   */
  public getCurrentModalState(): TaskModalConfig {
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
   * Get the task being edited (if any)
   */
  public getEditingTask(): Task | null {
    return this.modalStateSubject.value.task || null;
  }

  /**
   * Reset the service state (useful for cleanup)
   */
  public reset(): void {
    this.modalStateSubject.next({
      isVisible: false,
      mode: 'create',
      task: null
    });
  }
}