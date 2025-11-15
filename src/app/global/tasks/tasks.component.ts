import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/global/task.service';
import { TaskModalService } from '../../dashboard/home/services/task-modal.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  public day: string = '';

  constructor(
    private taskService: TaskService,
    private readonly taskFormService: TaskModalService
  ) { }

  ngOnInit(): void {
    this.taskService.setDay.subscribe((data) => {
      this.day = data;
    })
  }


  openTaskForm() {
    this.taskFormService.openCreateModal();
  }
}
