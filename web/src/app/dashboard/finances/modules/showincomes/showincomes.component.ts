import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancesService } from '../../core/services/finances.service';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';
import { Income } from '../../core/models/database/Income.model';
import { Origin } from '../../core/models/database/Origin.model';

@Component({
  selector: 'app-showincomes',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    DropdownModule,
    TagModule,
    SliderModule,
    ProgressBarModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './showincomes.component.html',
  styleUrls: [
    './showincomes.component.scss',
    '/src/app/core/styles/primeng/table.scss',
  ],
})
export class ShowincomesComponent implements OnInit {
  incomes!: Income[];

  selectedCustomers!: Customer[];

  origins!: Origin[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
  public globalFilterOptions: string[] = ['concept', 'amount', 'origin.name'];
  public globalFilter: string = '';

  constructor(private financesServices: FinancesService) {}

  ngOnInit(): void {
    this.financesServices
      .getIncomes()
      .subscribe((responseIncomes: HttpResponse) => {
        this.incomes = responseIncomes.data as Income[];
        this.loading = false;
        this.incomes.forEach(
          (income) => (income.created_at = new Date(<Date>income.created_at))
        );
      });

    this.initialize();

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' },
    ];
  }

  private initialize() {
    this.financesServices.getOrigins().subscribe({
      next: (response: HttpResponse) => {
        if (response.success) {
          this.origins = response.data;
        }
      },
    });
  }

  public getSeverity(status: string): string | undefined {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return undefined;
    }
    return undefined;
  }
}

interface Customer {
  id?: number;
  name?: string;
  company?: string;
  date?: string | Date;
  status?: string;
  activity?: number;
  verified?: boolean;
  balance?: number;
}
