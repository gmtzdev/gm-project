import { CategoryTask } from '../models/database/CategotyTask.model';
import { List } from '../models/database/List.model';

export class CreateTaskDto {
  public title: string;
  public owner?: number;
  public assigned?: number;
  public duedate?: Date;
  public note?: string;
  public list?: List;
  public categories?: CategoryTask[];
  
  // Schedule fields
  public startTime?: string;
  public endTime?: string;
  
  // Repeat fields
  public repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'workdays' | 'weekends' | 'custom';
  public repeatInterval?: number;
  public repeatUntil?: Date;
  public customDays?: string[];

  constructor(createTaskDto: CreateTaskDto) {
    this.title = createTaskDto.title;
    this.owner = createTaskDto.owner;
    this.assigned = createTaskDto.assigned;
    this.duedate = createTaskDto.duedate;
    this.note = createTaskDto.note;
    this.list = createTaskDto.list;
    this.categories = createTaskDto.categories;
    this.startTime = createTaskDto.startTime;
    this.endTime = createTaskDto.endTime;
    this.repeatType = createTaskDto.repeatType;
    this.repeatInterval = createTaskDto.repeatInterval;
    this.repeatUntil = createTaskDto.repeatUntil;
    this.customDays = createTaskDto.customDays;
  }
}
