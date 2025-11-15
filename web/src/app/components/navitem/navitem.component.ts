import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavItem } from '../../shared/models/navitem.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navitem',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="navitem"
      [ngClass]="{ collapse: collapse }"
      [routerLink]="navItem.route"
      [routerLinkActive]="'active'"
      [routerLinkActiveOptions]="{ exact: navItem.exact }"
    >
      <div class="icon">
        <i class="pi {{ navItem.icon }}"></i>
      </div>

      <div class="title" [ngClass]="{ dn: collapse }">
        <span>{{ navItem.title }}</span>
      </div>
    </div>
  `,
  styleUrl: './navitem.component.scss',
})
export class NavitemComponent {
  @Input() collapse: boolean = true;
  @Input() navItem: NavItem = {
    id: 0,
    title: '',
    icon: '',
    route: '',
    exact: false,
  };
}
