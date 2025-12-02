import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  UserProfile,
  UserStats,
  UserActivity,
  PasswordChangeRequest,
  AvatarUploadResponse,
  UserDataExport
} from './profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/user'; // Ajusta según tu API

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el perfil completo del usuario
   */
  getUserProfile(): Observable<UserProfile> {
    // TODO: Reemplazar con llamada real a la API
    // return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
    
    // Mock data para desarrollo
    return of(this.getMockProfile()).pipe(delay(500));
  }

  /**
   * Obtiene las estadísticas del usuario
   */
  getUserStats(): Observable<UserStats> {
    // TODO: Reemplazar con llamada real a la API
    // return this.http.get<UserStats>(`${this.apiUrl}/stats`);
    
    // Mock data para desarrollo
    return of(this.getMockStats()).pipe(delay(500));
  }

  /**
   * Obtiene las actividades recientes del usuario
   */
  getRecentActivities(limit: number = 10): Observable<UserActivity[]> {
    // TODO: Reemplazar con llamada real a la API
    // return this.http.get<UserActivity[]>(`${this.apiUrl}/activities`, {
    //   params: { limit: limit.toString() }
    // });
    
    // Mock data para desarrollo
    return of(this.getMockActivities()).pipe(
      delay(500),
      map(activities => activities.slice(0, limit))
    );
  }

  /**
   * Actualiza el perfil del usuario
   */
  updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    // TODO: Reemplazar con llamada real a la API
    // return this.http.put<UserProfile>(`${this.apiUrl}/profile`, profile);
    
    // Mock response para desarrollo
    return of({ ...this.getMockProfile(), ...profile } as UserProfile).pipe(delay(500));
  }

  /**
   * Cambia la contraseña del usuario
   */
  updatePassword(oldPassword: string, newPassword: string): Observable<{ message: string }> {
    const request: PasswordChangeRequest = { oldPassword, newPassword };
    
    // TODO: Reemplazar con llamada real a la API
    // return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, request);
    
    // Mock response para desarrollo
    return of({ message: 'Contraseña actualizada correctamente' }).pipe(delay(500));
  }

  /**
   * Sube un nuevo avatar para el usuario
   */
  uploadAvatar(file: File): Observable<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // TODO: Reemplazar con llamada real a la API
    // return this.http.post<AvatarUploadResponse>(`${this.apiUrl}/avatar`, formData);
    
    // Mock response para desarrollo
    return of({
      avatarUrl: 'https://i.pravatar.cc/300?img=' + Math.floor(Math.random() * 70),
      message: 'Avatar actualizado correctamente'
    }).pipe(delay(1000));
  }

  /**
   * Exporta todos los datos del usuario
   */
  exportUserData(): Observable<UserDataExport> {
    // TODO: Reemplazar con llamada real a la API
    // return this.http.get<UserDataExport>(`${this.apiUrl}/export`);
    
    // Mock data para desarrollo
    return of({
      profile: this.getMockProfile(),
      stats: this.getMockStats(),
      activities: this.getMockActivities(),
      exportDate: new Date()
    }).pipe(delay(1000));
  }

  // ==================== MOCK DATA ====================
  // Estos métodos deben ser eliminados cuando se integre con la API real

  private getMockProfile(): UserProfile {
    return {
      id: '1',
      email: 'usuario@ejemplo.com',
      firstName: 'Juan',
      lastName: 'Pérez García',
      phone: '+52 123 456 7890',
      bio: 'Desarrollador apasionado por crear soluciones innovadoras. Me encanta aprender nuevas tecnologías y compartir conocimientos con la comunidad.',
      location: 'Ciudad de México, México',
      avatar: 'https://i.pravatar.cc/300?img=12',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: new Date(2024, 0, 15),
      lastLogin: new Date(),
      preferences: {
        language: 'Español',
        timezone: 'America/Mexico_City',
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        pushNotifications: false
      }
    };
  }

  private getMockStats(): UserStats {
    return {
      totalActivities: 342,
      tasksCompleted: 156,
      paymentsCompleted: 89,
      goalsAchieved: 23,
      activityByDay: [
        { day: 'Lun', count: 12 },
        { day: 'Mar', count: 18 },
        { day: 'Mié', count: 15 },
        { day: 'Jue', count: 22 },
        { day: 'Vie', count: 19 },
        { day: 'Sáb', count: 8 },
        { day: 'Dom', count: 5 }
      ],
      monthlyProgress: {
        current: 78,
        target: 100,
        percentage: 78
      }
    };
  }

  private getMockActivities(): UserActivity[] {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'task_completed',
        title: 'Tarea completada',
        description: 'Completaste la tarea "Revisar documentación del proyecto"',
        timestamp: new Date(now.getTime() - 1000 * 60 * 15), // 15 minutos atrás
      },
      {
        id: '2',
        type: 'payment_made',
        title: 'Pago realizado',
        description: 'Realizaste el pago de la tarjeta de crédito por $2,500 MXN',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 horas atrás
      },
      {
        id: '3',
        type: 'goal_achieved',
        title: 'Objetivo alcanzado',
        description: 'Alcanzaste tu objetivo de ahorro mensual',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 horas atrás
      },
      {
        id: '4',
        type: 'task_created',
        title: 'Nueva tarea creada',
        description: 'Creaste la tarea "Preparar presentación para reunión"',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 día atrás
      },
      {
        id: '5',
        type: 'debt_paid',
        title: 'Deuda pagada',
        description: 'Pagaste $1,000 MXN de tu deuda personal',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 días atrás
      },
      {
        id: '6',
        type: 'profile_updated',
        title: 'Perfil actualizado',
        description: 'Actualizaste tu información de contacto',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3), // 3 días atrás
      },
      {
        id: '7',
        type: 'task_completed',
        title: 'Tarea completada',
        description: 'Completaste la tarea "Enviar reporte semanal"',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4), // 4 días atrás
      },
      {
        id: '8',
        type: 'payment_made',
        title: 'Pago realizado',
        description: 'Realizaste el pago de servicios por $850 MXN',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), // 5 días atrás
      },
      {
        id: '9',
        type: 'task_created',
        title: 'Nueva tarea creada',
        description: 'Creaste la tarea "Actualizar base de datos"',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6), // 6 días atrás
      },
      {
        id: '10',
        type: 'login',
        title: 'Inicio de sesión',
        description: 'Iniciaste sesión desde un nuevo dispositivo',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7), // 7 días atrás
      }
    ];
  }
}
