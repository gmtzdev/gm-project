import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.scss',
})
export class FinancesComponent {}
