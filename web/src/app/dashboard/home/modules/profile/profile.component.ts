import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from './profile.service';
import { UserProfile, UserStats, UserActivity, QuickAction } from './profile.interface';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-profile',
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        AvatarModule,
        BadgeModule,
        ChartModule,
        TableModule,
        TagModule,
        TimelineModule,
        DialogModule,
        InputTextModule,
        // InputTextareaModule,
        FileUploadModule,
        ProgressBarModule,
        TooltipModule,
        TabViewModule,
        SkeletonModule
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile = signal<UserProfile | null>(null);
  userStats = signal<UserStats | null>(null);
  recentActivities = signal<UserActivity[]>([]);
  quickActions = signal<QuickAction[]>([]);
  loading = signal<boolean>(true);
  
  // Diálogos
  showEditDialog = signal<boolean>(false);
  showPasswordDialog = signal<boolean>(false);
  showAvatarDialog = signal<boolean>(false);
  
  // Datos temporales para edición
  editedProfile: Partial<UserProfile> = {};
  
  // Gráficos
  activityChartData: any;
  activityChartOptions: any;
  productivityChartData: any;
  productivityChartOptions: any;

    constructor(
        private readonly profileService: ProfileService
    ) 
    {
        this.initializeChartOptions();
    }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserStats();
    this.loadRecentActivities();
    this.loadQuickActions();
  }

  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading.set(false);
      }
    });
  }

  loadUserStats(): void {
    this.profileService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats.set(stats);
        this.updateActivityChart(stats);
        this.updateProductivityChart(stats);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadRecentActivities(): void {
    this.profileService.getRecentActivities(10).subscribe({
      next: (activities) => {
        this.recentActivities.set(activities);
      },
      error: (error) => {
        console.error('Error loading activities:', error);
      }
    });
  }

  loadQuickActions(): void {
    const actions: QuickAction[] = [
      {
        icon: 'pi pi-pencil',
        label: 'Editar Perfil',
        action: () => this.openEditDialog(),
        color: 'primary'
      },
      {
        icon: 'pi pi-lock',
        label: 'Cambiar Contraseña',
        action: () => this.openPasswordDialog(),
        color: 'secondary'
      },
      {
        icon: 'pi pi-download',
        label: 'Exportar Datos',
        action: () => this.exportUserData(),
        color: 'info'
      },
      {
        icon: 'pi pi-chart-line',
        label: 'Ver Estadísticas',
        action: () => this.scrollToStats(),
        color: 'success'
      }
    ];
    this.quickActions.set(actions);
  }

  openEditDialog(): void {
    const profile = this.userProfile();
    if (profile) {
      this.editedProfile = { ...profile };
      this.showEditDialog.set(true);
    }
  }

  openPasswordDialog(): void {
    this.showPasswordDialog.set(true);
  }

  openAvatarDialog(): void {
    this.showAvatarDialog.set(true);
  }

  saveProfile(): void {
    this.profileService.updateUserProfile(this.editedProfile).subscribe({
      next: (updatedProfile) => {
        this.userProfile.set(updatedProfile);
        this.showEditDialog.set(false);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
      }
    });
  }

  updatePassword(oldPassword: string, newPassword: string): void {
    this.profileService.updatePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.showPasswordDialog.set(false);
        // Show success message
      },
      error: (error) => {
        console.error('Error updating password:', error);
      }
    });
  }

  uploadAvatar(event: any): void {
    const file = event.files[0];
    this.profileService.uploadAvatar(file).subscribe({
      next: (response) => {
        const profile = this.userProfile();
        if (profile) {
          this.userProfile.set({ ...profile, avatar: response.avatarUrl });
        }
        this.showAvatarDialog.set(false);
      },
      error: (error) => {
        console.error('Error uploading avatar:', error);
      }
    });
  }

  exportUserData(): void {
    this.profileService.exportUserData().subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-data-${new Date().getTime()}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error exporting data:', error);
      }
    });
  }

  scrollToStats(): void {
    const statsElement = document.getElementById('user-stats');
    if (statsElement) {
      statsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      'task_completed': 'pi pi-check-circle',
      'task_created': 'pi pi-plus-circle',
      'payment_made': 'pi pi-money-bill',
      'debt_paid': 'pi pi-wallet',
      'goal_achieved': 'pi pi-trophy',
      'login': 'pi pi-sign-in',
      'profile_updated': 'pi pi-user-edit',
      'default': 'pi pi-info-circle'
    };
    return icons[type] || icons['default'];
  }

  getActivityColor(type: string): string {
    const colors: Record<string, string> = {
      'task_completed': 'success',
      'task_created': 'info',
      'payment_made': 'warning',
      'debt_paid': 'primary',
      'goal_achieved': 'success',
      'login': 'secondary',
      'profile_updated': 'info',
      'default': 'secondary'
    };
    return colors[type] || colors['default'];
  }

  getCompletionPercentage(): number {
    const profile = this.userProfile();
    if (!profile) return 0;
    
    const fields = [
      profile.email,
      profile.firstName,
      profile.lastName,
      profile.phone,
      profile.bio,
      profile.location,
      profile.avatar
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }

  private initializeChartOptions(): void {
    this.activityChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };

    this.productivityChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  private updateActivityChart(stats: UserStats): void {
    this.activityChartData = {
      labels: ['Tareas', 'Finanzas', 'Objetivos', 'Otros'],
      datasets: [
        {
          data: [
            stats.tasksCompleted,
            stats.paymentsCompleted,
            stats.goalsAchieved,
            stats.totalActivities - (stats.tasksCompleted + stats.paymentsCompleted + stats.goalsAchieved)
          ],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC']
        }
      ]
    };
  }

  private updateProductivityChart(stats: UserStats): void {
    const last7Days = stats.activityByDay || [];
    this.productivityChartData = {
      labels: last7Days.map(d => d.day),
      datasets: [
        {
          label: 'Actividades',
          data: last7Days.map(d => d.count),
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          tension: 0.4
        }
      ]
    };
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return d.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
