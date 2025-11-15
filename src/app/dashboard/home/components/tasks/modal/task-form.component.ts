import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { TaskModalService } from '../../../services/task-modal.service';
import { TaskService } from '../../../core/service/task.service';
import { Task } from '../../../core/models/database/Task.model';
import { List } from '../../../core/models/database/List.model';
import { CreateTaskDto } from '../../../core/dto/create-task.dto';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h3>
          <button type="button" class="close-btn" (click)="onClose()">×</button>
        </div>
        
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
          <div class="form-group">
            <label for="title">Task Title *</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              [class.invalid]="isFieldInvalid('title')"
              placeholder="Enter task title"
            />
            <div class="error-message" *ngIf="isFieldInvalid('title')">
              {{ getFieldErrorMessage('title') }}
            </div>
          </div>

          <div class="form-group">
            <label for="note">Note</label>
            <textarea
              id="note"
              formControlName="note"
              rows="3"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="duedate">Due Date</label>
            <input
              id="duedate"
              type="datetime-local"
              formControlName="duedate"
            />
          </div>

          <div class="form-group">
            <label for="assigned">Assigned To</label>
            <input
              id="assigned"
              type="text"
              formControlName="assigned"
              placeholder="Enter assignee"
            />
          </div>

          <div class="form-group">
            <label for="owner">Owner</label>
            <input
              id="owner"
              type="text"
              formControlName="owner"
              placeholder="Enter owner"
            />
          </div>

          <div class="form-group">
            <label for="list">List</label>
            <select id="list" formControlName="list">
              <option value="">Select a list</option>
              <option *ngFor="let list of availableLists" [value]="list.id">
                {{ list.name }}
              </option>
            </select>
          </div>

          <!-- Schedule Section -->
          <div class="form-section">
            <h4 class="section-title">Schedule</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="time"
                  formControlName="startTime"
                  placeholder="10:00"
                />
              </div>

              <div class="form-group">
                <label for="endTime">End Time</label>
                <input
                  id="endTime"
                  type="time"
                  formControlName="endTime"
                  placeholder="15:00"
                />
              </div>
            </div>
          </div>

          <!-- Repeat Section -->
          <div class="form-section">
            <h4 class="section-title">Repeat Options</h4>
            
            <div class="form-group">
              <label for="repeatType">Repeat</label>
              <select id="repeatType" formControlName="repeatType">
                <option value="">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="workdays">Workdays (Mon-Fri)</option>
                <option value="weekends">Weekends (Sat-Sun)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <!-- Custom Repeat Days (only show when custom is selected) -->
            <div class="form-group" *ngIf="taskForm.get('repeatType')?.value === 'custom'">
              <label>Custom Days</label>
              <div class="days-selector">
                <label class="day-checkbox" *ngFor="let day of weekDays; let i = index">
                  <input 
                    type="checkbox" 
                    [value]="day.value"
                    (change)="onDayChange($event, day.value)"
                    [checked]="selectedDays.includes(day.value)"
                  />
                  <span class="checkmark"></span>
                  {{ day.label }}
                </label>
              </div>
            </div>

            <!-- Repeat Until -->
            <div class="form-group" *ngIf="taskForm.get('repeatType')?.value && taskForm.get('repeatType')?.value !== ''">
              <label for="repeatUntil">Repeat Until (Optional)</label>
              <input
                id="repeatUntil"
                type="date"
                formControlName="repeatUntil"
                placeholder="Select end date"
              />
              <small class="form-hint">Leave empty for no end date</small>
            </div>

            <!-- Repeat Interval -->
            <div class="form-group" *ngIf="taskForm.get('repeatType')?.value && taskForm.get('repeatType')?.value !== '' && taskForm.get('repeatType')?.value !== 'custom'">
              <label for="repeatInterval">Repeat Every</label>
              <div class="interval-input">
                <input
                  id="repeatInterval"
                  type="number"
                  formControlName="repeatInterval"
                  min="1"
                  max="365"
                  placeholder="1"
                />
                <span class="interval-label">{{ getIntervalLabel() }}</span>
              </div>
              <small class="form-hint">Example: Every 2 weeks, Every 3 days</small>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="onClose()">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-save" 
              [disabled]="isLoading || !taskForm.valid"
            >
              {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit, OnDestroy {

  // Form and states
  taskForm!: FormGroup;
  isLoading = false;
  isVisible = false;
  isEditMode = false;
  editingTask: Task | null = null;

  // Available lists (you might need to fetch these)
  availableLists: List[] = [];

  // Week days for custom repeat selection
  weekDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  // Selected days for custom repeat
  selectedDays: string[] = [];

  // Unsubscribe subject
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private taskModalService: TaskModalService,
    private taskService: TaskService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Subscribe to modal state changes
    this.taskModalService.modalState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(state => {
        this.isVisible = state.isVisible;
        this.isEditMode = state.mode === 'edit';
        this.editingTask = state.task || null;

        if (this.isVisible) {
          if (this.isEditMode && this.editingTask) {
            this.loadTaskData(this.editingTask);
          } else {
            this.resetForm();
          }
        }
      });

    // Subscribe to form close events
    this.taskModalService.formClose$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.resetForm();
      });

    // Load available lists (you might want to fetch this from a service)
    this.loadAvailableLists();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Initialize the reactive form
   */
  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      note: [''],
      duedate: [''],
      list: [''],
      assigned: [''],
      owner: [''],
      // Schedule fields
      startTime: [''],
      endTime: [''],
      // Repeat fields
      repeatType: [''],
      repeatInterval: [1, [Validators.min(1)]],
      repeatUntil: [''],
      customDays: [[]]
    });
  }

  /**
   * Load task data into the form for editing
   */
  private loadTaskData(task: Task): void {
    // Load basic task data
    this.taskForm.patchValue({
      title: task.title,
      note: task.note || '',
      duedate: task.duedate ? this.formatDateForInput(task.duedate) : '',
      list: task.list?.id || '',
      assigned: task.assigned || '',
      owner: task.owner || '',
      // Schedule data (if available in task model)
      startTime: (task as any).startTime || '',
      endTime: (task as any).endTime || '',
      // Repeat data (if available in task model)
      repeatType: (task as any).repeatType || '',
      repeatInterval: (task as any).repeatInterval || 1,
      repeatUntil: (task as any).repeatUntil ? this.formatDateOnly((task as any).repeatUntil) : '',
      customDays: (task as any).customDays || []
    });
    
    // Load selected days for custom repeat
    if ((task as any).customDays) {
      this.selectedDays = (task as any).customDays;
    } else {
      this.selectedDays = [];
    }
  }

  /**
   * Format date for HTML datetime-local input
   */
  private formatDateForInput(dateInput: Date | string): string {
    const dateObj = new Date(dateInput);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Format date for HTML date input (date only, no time)
   */
  private formatDateOnly(dateInput: Date | string): string {
    const dateObj = new Date(dateInput);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    this.taskForm.reset();
    this.isLoading = false;
  }

  /**
   * Load available lists for selection
   */
  private loadAvailableLists(): void {
    // TODO: Implement list fetching from a service
    // For now, we'll use an empty array or mock data
    this.availableLists = [];
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.taskForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formValue = this.taskForm.value;
      
      if (this.isEditMode && this.editingTask) {
        // Update existing task
        const updatedTask: Task = {
          ...this.editingTask,
          title: formValue.title,
          note: formValue.note,
          duedate: formValue.duedate || null,
          assigned: formValue.assigned,
          owner: formValue.owner,
          list: this.availableLists.find(list => list.id === formValue.list) || this.editingTask.list,
          // Schedule fields
          startTime: formValue.startTime || undefined,
          endTime: formValue.endTime || undefined,
          // Repeat fields
          repeatType: formValue.repeatType || undefined,
          repeatInterval: formValue.repeatInterval || undefined,
          repeatUntil: formValue.repeatUntil || undefined,
          customDays: formValue.repeatType === 'custom' ? this.selectedDays : undefined
        };

        // TODO: Implement update task service call
        this.taskModalService.handleFormSubmit(updatedTask);
      } else {
        // Create new task
        const newTaskDto: CreateTaskDto = {
          title: formValue.title,
          note: formValue.note,
          duedate: formValue.duedate || undefined,
          assigned: formValue.assigned,
          owner: formValue.owner,
          list: formValue.list || undefined,
          categories: [], // Default empty categories
          // Schedule fields
          startTime: formValue.startTime || undefined,
          endTime: formValue.endTime || undefined,
          // Repeat fields
          repeatType: formValue.repeatType || undefined,
          repeatInterval: formValue.repeatInterval || undefined,
          repeatUntil: formValue.repeatUntil || undefined,
          customDays: formValue.repeatType === 'custom' ? this.selectedDays : undefined
        };

        this.taskService.saveTask(newTaskDto)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (createdTask) => {
              this.taskModalService.handleFormSubmit(createdTask);
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error creating task:', error);
              this.isLoading = false;
              // TODO: Add proper error handling/notification
            }
          });
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.taskForm);
    }
  }

  /**
   * Close the modal
   */
  onClose(): void {
    this.taskModalService.closeModal();
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if a form field has an error and is touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Get error message for a specific field
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    
    return '';
  }

  /**
   * Get display name for form fields
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'title': 'Task title',
      'note': 'Note',
      'duedate': 'Due date',
      'list': 'List',
      'assigned': 'Assigned to',
      'owner': 'Owner',
      'startTime': 'Start time',
      'endTime': 'End time',
      'repeatType': 'Repeat type',
      'repeatInterval': 'Repeat interval',
      'repeatUntil': 'Repeat until'
    };
    
    return displayNames[fieldName] || fieldName;
  }

  /**
   * Handle custom day selection changes
   */
  onDayChange(event: Event, dayValue: string): void {
    const target = event.target as HTMLInputElement;
    
    if (target.checked) {
      if (!this.selectedDays.includes(dayValue)) {
        this.selectedDays.push(dayValue);
      }
    } else {
      this.selectedDays = this.selectedDays.filter(day => day !== dayValue);
    }
    
    // Update form control
    this.taskForm.patchValue({ customDays: this.selectedDays });
  }

  /**
   * Get the appropriate interval label based on repeat type
   */
  getIntervalLabel(): string {
    const repeatType = this.taskForm.get('repeatType')?.value;
    
    switch (repeatType) {
      case 'daily':
        return 'day(s)';
      case 'weekly':
        return 'week(s)';
      case 'monthly':
        return 'month(s)';
      case 'yearly':
        return 'year(s)';
      case 'workdays':
        return 'workday cycle(s)';
      case 'weekends':
        return 'weekend cycle(s)';
      default:
        return 'time(s)';
    }
  }
}