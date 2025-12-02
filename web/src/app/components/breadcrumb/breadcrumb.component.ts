import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];

  public navigateTo(item: BreadcrumbItem): void {
    if (item.url) {
      // Navigation logic can be added here if needed
      console.log('Navigate to:', item.url);
    }
  }

  public isLast(index: number): boolean {
    return index === this.items.length - 1;
  }
}
