import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-avatar',
    imports: [CommonModule],
    templateUrl: './user-avatar.component.html',
    styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent implements OnInit {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showName: boolean = true;
  
  public user: User | null = null;
  public initials: string = '';
  public showDropdown: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.initials = this.getInitials(user?.name || '');
    });
  }

  private getInitials(name: string): string {
    if (!name) return 'U';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  public toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  public profile(): void {
    // Navigate to profile page
    // Assuming you have a router service to handle navigation
    this.router.navigate(['/dashboard/profile']);
    this.showDropdown = false;
  }

  public logout(): void {
    this.authService.logout();
    this.showDropdown = false;
  }
}
