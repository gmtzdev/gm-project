import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddContributionModalService {
  @Output() animationEmitter: EventEmitter<{
    id: number;
    objective: string;
    amount: number;
  }> = new EventEmitter();

  constructor() {}
}
