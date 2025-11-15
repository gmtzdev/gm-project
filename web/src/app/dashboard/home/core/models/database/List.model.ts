import { Task } from './Task.model';

export class List {
  public id: number;
  public name: string;
  public icon: string;
  public counter: number;
  public deleted_at: Date;
  public tasks: Task[];

  constructor(list: List) {
    this.id = list.id;
    this.name = list.name;
    this.icon = list.icon;
    this.counter = list.counter;
    this.deleted_at = list.deleted_at;
    this.tasks = list.tasks;
  }
}
