import { Component } from '@angular/core';
import { FinancesService } from '../../core/services/finances.service';
import { Debt } from '../../core/models/database/Debt.model';
import { DebtGraphComponent } from '../../utils/debt-graph/debt-graph.component';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [DebtGraphComponent],
  templateUrl: './debts.component.html',
  styleUrl: './debts.component.scss',
})
export class DebtsComponent {
  public debts: Debt[] = [];

  constructor(private financesService: FinancesService) {}

  async ngOnInit() {
    this.financesService.getNoCompleteDebts().subscribe({
      next: (response: HttpResponse) => {
        this.debts = response.data;
      },
    });
  }
}
