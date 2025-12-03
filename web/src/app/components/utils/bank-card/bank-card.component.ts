import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-bank-card',
    imports: [],
    templateUrl: './bank-card.component.html',
    styleUrl: './bank-card.component.scss'
})
export class BankCardComponent {
  @Input() CardName: string = '';
}
