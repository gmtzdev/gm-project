import { List } from "./List.model";

export class Task {
  public id: number;
  public title: string;
  public ready: boolean;
  public owner: number;
  public assigned: number;
  public duedate: Date;
  public note: string;
  public created_at: Date;
  public updated_at: Date;
  public deleted_at: Date;
  public list!: List;
  //   public categories!: CategoryTask[];
  
  // Schedule fields
  public startTime?: string;
  public endTime?: string;
  
  // Repeat fields
  public repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'workdays' | 'weekends' | 'custom';
  public repeatInterval?: number;
  public repeatUntil?: Date;
  public customDays?: string[];

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.ready = task.ready;
    this.owner = task.owner;
    this.assigned = task.assigned;
    this.duedate = task.duedate;
    this.note = task.note;
    this.created_at = task.created_at;
    this.updated_at = task.updated_at;
    this.deleted_at = task.deleted_at;
    this.startTime = task.startTime;
    this.endTime = task.endTime;
    this.repeatType = task.repeatType;
    this.repeatInterval = task.repeatInterval;
    this.repeatUntil = task.repeatUntil;
    this.customDays = task.customDays;
  }
}
