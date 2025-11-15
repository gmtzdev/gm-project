/* PrimeNG */
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Tag, TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

/* Core */
import { Component } from '@angular/core';
import { FinancesService } from '../../core/services/finances.service';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../core/models/database/Card.model';
import { Payment } from '../../core/models/database/Payment.model';
import { BillToTable } from '../../core/models/BillToTable.model';
import { Router } from '@angular/router';
import { Institution } from '../../core/models/database/Institution.model';
import { Bill } from '../../core/models/database/Bill.model';
import { MessageService } from 'primeng/api';
import { BillMetrics } from '../../core/classes/BillMetrics';

@Component({
  selector: 'app-showbills',
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
    DialogModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './showbills.component.html',
  styleUrls: [
    './showbills.component.scss',
    '/src/app/core/styles/primeng/table.scss',
  ],
  providers: [MessageService],
})
export class ShowbillsComponent {
  bills!: BillToTable[];
  selectedBills: Bill[] = [];
  institutions!: Institution[];
  cards!: Card[];
  payments!: { id: number; name: string }[];
  paymentsOptions: string[] = [];
  categories!: { id: number; name: string }[];
  categoriesOptions: string[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  public globalFilterOptions: string[] = [
    'concept',
    'amount',
    'institution.name',
    'paymentColumn',
    'card.name',
  ];
  public globalFilter: string = '';
  public payMethod!: string;

  public metrics: BillMetrics = new BillMetrics(this.selectedBills);
  visible: boolean = false;
  showDialog() {
    if (this.selectedBills.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Must selected any bill',
        life: 2000000,
      });
      return;
    }
    let count = 0;
    for (const bill of this.selectedBills) {
      count += bill.amount;
    }

    const metrics = new BillMetrics(this.selectedBills);
    this.metrics = metrics;
    this.visible = true;
  }

  constructor(
    private readonly financesServices: FinancesService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.financesServices
      .getBills()
      .subscribe((responseBills: HttpResponse) => {
        this.bills = responseBills.data as BillToTable[];
        this.loading = false;
        this.bills.forEach((bill) => {
          bill.created_at = new Date(<Date>bill.created_at);
          bill.paymentColumn = bill.payment.name;
        });
      });

    this.financesServices.getPayments().subscribe({
      next: (responsePayments: HttpResponse) => {
        if (!responsePayments.success) {
          // Error
          return;
        }
        this.payments = responsePayments.data as Payment[];
        this.payments.forEach((payment) => {
          this.paymentsOptions.push(payment.name);
        });
      },
    });

    this.financesServices.getInstitutions().subscribe({
      next: (responseInstitutions: HttpResponse) => {
        this.institutions = responseInstitutions.data as Institution[];
      },
    });

    this.cards = [
      {
        id: 3,
        name: 'BBVA Azul',
        owner: 1,
        reference: '4006',
        type: 2,
        sequence: 1,
      },
      {
        id: 2,
        name: 'BBVA Débito',
        owner: 1,
        reference: '9002',
        type: 2,
        sequence: 2,
      },
      {
        id: 1,
        name: 'Efectivo',
        owner: 1,
        reference: '',
        type: 1,
        sequence: 3,
      },
    ];

    this.financesServices.getCartegories().subscribe({
      next: (responseCategories: HttpResponse) => {
        if (!responseCategories.success) {
          // Error
          return;
        }
        this.categories = responseCategories.data as Payment[];
        this.categories.forEach((category) => {
          this.categoriesOptions.push(category.name);
        });
      },
    });
  }

  public getSeverity(status: string | number): Tag['severity'] {
    return typeof status === 'string'
      ? this.getSeverityByName(status)
      : this.getSeverityById(status);
  }
  public getSeverityByName(status: string): Tag['severity'] {
    switch (status) {
      case 'Efectivo':
        return 'success';
      case 'Tarjeta de debito':
        return 'info';
      case 'Tarjeta de credito':
        return undefined;
      default:
        return 'danger';
    }
  }
  public getSeverityById(status: number): Tag['severity'] {
    switch (status) {
      case 1:
        return 'success';
      case 2:
        return 'info';
      case 3:
        return undefined;
      default:
        return 'danger';
    }
  }

  public editBill(id: number) {
    this.router.navigate(['dashboard', 'finances', 'editBills', id]);
  }

  public navigateTo(destination: string) {
    window.open(destination, '_blank');
  }
}
