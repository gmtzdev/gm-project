import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TaskService } from '../../core/service/task.service';
import { Task } from '../../core/models/database/Task.model';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';
import { ListService } from '../../core/service/list.service';
import { List } from '../../core/models/database/List.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryService } from '../../core/service/category.service';
import { CategoryTask } from '../../core/models/database/CategotyTask.model';
import { SelectableList } from '../../core/models/class/SelectableList.model';
import { CommonModule } from '@angular/common';
import { SelectableCategoryTask } from '../../core/models/class/SelectableCategoryTask.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CheckboxModule,
    OverlayPanelModule,
    CommonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss',
})
export class TodolistComponent implements OnInit {
  private selectedList!: List;
  private onSave: boolean = false;
  private defaultList: List = new List({
    id: 1,
    name: 'Mi Lista',
    icon: 'fa-list-check',
    counter: 0,
    deleted_at: new Date(),
    tasks: [],
  });

  //==== Methods to show Toast ====\\
  private showToast(severity:string, summary: string, detail: string): void {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  constructor(
    private readonly taskService: TaskService,
    private readonly listService: ListService,
    private readonly categoryService: CategoryService,
    private readonly messageService: MessageService
  ) {}

  public lists: SelectableList[] = [];
  public categories: SelectableCategoryTask[] = [];
  public tasks: Task[] = [];
  public createTaskDto: FormGroup = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    owner: new FormControl<number>(1),
    assigned: new FormControl<number>(1),
    duedate: new FormControl<Date>(new Date()),
    note: new FormControl<string>(''),
    list: new FormControl<List>(this.defaultList),
  });

  ngOnInit(): void {
    this.initialize();
  }

  private async initialize() {
    // Get the default list to show some task
    // and defined the currently selected list
    this.selectedList = this.defaultList;
    this.taskService.getTaskListOfFilter(this.defaultList).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
    });

    this.listService.getAllList().subscribe({
      next: (lists: List[]) => {
        for (const [index, l] of lists.entries()) {
          const sl = new SelectableList(l);
          if (index === 0) sl.selected = true;
          this.lists.push(sl);
        }
      },
    });
    this.categoryService.getAllCategories().subscribe({
      next: (categories: CategoryTask[]) => {
        for (const c of categories) {
          const sc = new SelectableCategoryTask(c);
          this.categories.push(sc);
        }
      },
    });
  }
  private resetForm(formGroup: FormGroup): FormGroup {
    formGroup.reset({
      assigned: 1,
      duedate: new Date(),
      note: null,
      owner: 1,
      title: null,
      list: this.defaultList,
    });
    return formGroup;
  }

  /**
   * This method excecute when finish a taks and past it
   * to the finish tasks list.
   * Confirm the action with a message toast.
   * 
   * @param task 
   * @param ready 
   * @return { void }
   */
  public setReady(task: Task, ready: boolean): void {
    this.taskService.setReady(task.id, ready).subscribe({
      next: (response: HttpResponse) => {
        if (!response.success) {
          task.ready = !ready;
          return
        }
        if(ready)
          this.showToast('success', 'Success', 'The task was completed succcessfully');
        else
          this.showToast('info', 'Success', 'The task was rejected');
      },
      error: (response: HttpResponse) => {
        // TODO Implements messages toast
        console.log(response);
        task.ready = !ready;
      },
    });
  }
  help($event: MouseEvent) {
    // const ad = $event.target as HTMLElement;
    // console.log(ad.getBoundingClientRect());
    // $event.clientX = $event.clientX - 20;
    // $event.pageX = $event.pageX - 20;
    // $event.screenX = $event.screenX - 20;
    // $event.x = $event.x - 20;
    return $event;
  }
  public saveNewTask($event: KeyboardEvent) {
    if (!($event.code === 'Enter' && !this.onSave)) return;
    this.onSave = true;

    if (!this.createTaskDto.valid) {
      // for (let control in this.createTaskDto.controls) {
      //   if (!this.createTaskDto.controls[control].valid) {
      //     console.log(control);
      //   }
      // }
      return;
    }
    this.taskService.saveTask(this.createTaskDto.value).subscribe({
      next: (response: Task) => {
        if (!response.id) {
          return;
        }
        if(this.selectedList.id === response.list.id){
          this.tasks.push(response);
        }
        this.createTaskDto = this.resetForm(this.createTaskDto);
        this.onSave = false;
        this.showToast('success', 'Success', 'Task was saved successfully');
      },
    });
  }
  

  public findList(id: number, filter: number): void {
    this.lists.forEach((value) => {
      value.selected = false;
      if (filter !== 0) return;
      if (value.id === id) {
        this.defaultList = value;

        // To save the currently selected list
        this.selectedList = value;

        value.selected = true;
        this.createTaskDto.controls['list'].setValue(value);
        this.taskService.getTaskListOfFilter(value).subscribe({
          next: (tasks: Task[]) => {
            this.tasks = tasks;
          },
        });
      }
    });

    this.categories.forEach((value) => {
      value.selected = false;
      if (filter !== 1) return;
      if (value.id === id) {
        value.selected = true;
        this.taskService.getTaskListOfFilter(value).subscribe({
          next: (tasks: Task[]) => {
            this.tasks = tasks;
          },
        });
      }
    });
  }

  public selectList(id: number): void {
    this.defaultList =
      this.lists.find((value) => value.id === id) || this.defaultList;
    this.createTaskDto.controls['list'].setValue(this.defaultList);
  }
}
