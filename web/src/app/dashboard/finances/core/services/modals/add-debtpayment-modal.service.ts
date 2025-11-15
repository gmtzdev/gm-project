import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AddDebtpaymentModalService {
  @Output() animationEmitter: EventEmitter<{
    id: number;
    objective: string;
    amount: number;
  }> = new EventEmitter();

  constructor() {}
}
