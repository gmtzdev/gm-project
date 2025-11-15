import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewEventModalComponent } from './components/modals/new-event-modal/new-event-modal.component';
import SpinnerComponent from './shared/components/spinner.component';
import { AddcontributionModalComponent } from './dashboard/finances/modules/addcontribution-modal/addcontribution-modal.component';
import { SubscriptionFormComponent } from './dashboard/finances/components/subscriptions/modal/subscription-form.component';
import { TaskFormComponent } from './dashboard/home/components/tasks/modal/task-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NewEventModalComponent, AddcontributionModalComponent, SpinnerComponent,

    // Modals
    SubscriptionFormComponent,
    TaskFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'gm-project';

  public iterations: number = 1;

  constructor() { }

  ngOnInit(): void { }
}
