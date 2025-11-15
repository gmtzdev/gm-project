import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateModalService {

  @Output() animationEmitter: EventEmitter<any> = new EventEmitter();


  constructor() { }
}
