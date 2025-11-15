import { Component, OnInit } from '@angular/core';
import { NavitemComponent } from '../../components/navitem/navitem.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavItem } from '../../shared/models/navitem.model';
import { CalendarComponent } from '../../global/calendar/calendar.component';
import { TasksComponent } from '../../global/tasks/tasks.component';
import { WidgetsComponent } from '../../global/widgets/widgets.component';
import { GeneralService } from '../../shared/services/global/general.service';
import { HttpResponse } from '../../shared/models/http/HttpResponse.model';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,

    // Utils
    NavitemComponent,

    // Global
    CalendarComponent,
    TasksComponent,
    WidgetsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  public collapse: boolean = false;
  public navitems: NavItem[] = [];

  constructor(private generalService: GeneralService, private router: Router, private authService: AuthService) {}

  public collapseVerticalMenu() {
    this.collapse = !this.collapse;
  }

  public logout() {
    // Use the auth service to handle logout
    this.authService.logout();
  }

  ngOnInit(): void {
    this.initializer();
  }

  public async initializer() {
    this.generalService.getNavItems().subscribe({
      next: (response: HttpResponse) => {
        this.navitems = response.data as NavItem[];
        this.navitems.forEach((n) => {
          if (n.route === '') {
            n.exact = true;
          } else {
            n.exact = false;
          }
        });
      },
    });
  }
}
