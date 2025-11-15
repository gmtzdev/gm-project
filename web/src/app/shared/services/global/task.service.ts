import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  @Output() setDay: EventEmitter<string> = new EventEmitter();

  constructor() { }
}
