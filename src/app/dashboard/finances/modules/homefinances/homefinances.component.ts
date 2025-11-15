import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CardComponent } from '../../components/card/card.component';
import { IncomesyearComponent } from '../../components/incomesyear/incomesyear.component';
import { ObjetivesComponent } from '../../components/objetives/objetives.component';
import { BillscategoryComponent } from '../../components/billscategory/billscategory.component';
import { CardHome } from '../../core/models/CardHome.model';
import { FinancesService } from '../../core/services/finances.service';
import { concatMap, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { DebtsComponent } from '../../components/debts/debts.component';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';
import { ExpensesweekComponent } from '../../components/expensesweek/expensesweek.component';
import { FormsModule } from '@angular/forms';
import { DatesService } from '../../../../shared/services/global/dates.service';
import { SubscriptionsComponent } from '../../components/subscriptions/subscriptions.component';
import { SubscriptionModalService } from '../../components/subscriptions/modal/service/subscription-modal.service';
import { SubscriptionFormComponent } from '../../components/subscriptions/modal/subscription-form.component';

@Component({
  selector: 'app-homefinances',
  standalone: true,
  imports: [
    CardComponent,
    IncomesyearComponent,
    ExpensesweekComponent,
    ObjetivesComponent,
    BillscategoryComponent,
    DebtsComponent,
    SubscriptionsComponent,
    
    FormsModule,
    NgxChartsModule,

    // Modals
    SubscriptionFormComponent,
  ],
  templateUrl: './homefinances.component.html',
  styleUrl: './homefinances.component.scss',
})
export class HomefinancesComponent implements OnInit {
  private incomeIndex = 0;
  private billIndex = 0;
  public incomesPer: number[] = [];
  public billsPer: number[] = [];

  public cards: CardHome[] = [
    {
      id: 1,
      icon: 'fa-sack-dollar',
      destination: 'addIncome',
      title: 'Incomes',
      subtitle: 'year',
      subject: '$0',
      aditional: [],
    },
    {
      id: 2,
      icon: 'fa-circle-dollar-to-slot',
      destination: 'addBill',
      title: 'Bills',
      subtitle: 'year',
      subject: '$0',
      aditional: [],
    },
    {
      id: 3,
      icon: 'fa-cart-shopping',
      destination: '',
      title: 'Top Category',
      subtitle: '',
      subject: 'Not Found',
      aditional: [],
    },
    {
      id: 4,
      icon: 'fa-credit-card',
      destination: '',
      title: 'Pay at',
      subtitle: '',
      subject: 'Not Found',
      aditional: [],
    },
  ];

  public weeklyExpense: any;

  constructor(
    private financesService: FinancesService,
    private datesService: DatesService,
    private router: Router,
    private subscriptionModalService: SubscriptionModalService
  ) {}

  async ngOnInit(): Promise<void> {
    this.financesService.getIncomesPer().subscribe({
      next: (incomesPer: HttpResponse) => {
        if (incomesPer.success) {
          this.incomesPer = incomesPer.data.incomesPer;
          this.cards[0].subject = this.financesService.toMoneyFormat(
            this.incomesPer[this.incomeIndex]
          );
        }
      },
    });

    this.financesService.getBillsPer().subscribe({
      next: (billPer: HttpResponse) => {
        if (billPer.success) {
          this.billsPer = billPer.data.billsPer;
          this.cards[1].subject = this.financesService.toMoneyFormat(
            this.billsPer[this.billIndex]
          );
        }
      },
    });

    this.financesService
      .getTopOneCategory()
      .pipe(
        map((response: HttpResponse) => {
          if (!response.success) return 'Not found :c';
          return response.data.category;
        })
      )
      .subscribe({
        next: (category: string) => {
          this.cards[2].subject = category;
        },
      });

    this.financesService.getDaysToPayCreditCard().pipe(
      concatMap((response: HttpResponse)=>{
          if(!response) throw new Error('The response is not available');
          let daysLeftToPay = response.data;
          if(daysLeftToPay <= 0){
            this.cards[3].title = `Cut-Off Date In`;
            return this.financesService.getDaysToCutOffCreditCard();
          }
          return of(response);
      }) 
    ).subscribe({
      next: (response: HttpResponse) => {
        if (!response.success) return;
        this.cards[3].subject = `${response.data} days`;

        // If days to next cutt-off date is less of -1
        // caulculate the next month to pay credit card
        if(response.data <= -1){
          this.financesService.passToNextMonthCreditCard().subscribe({
            next: (response: HttpResponse) => {
              if(response.success){
                this.cards[3].title = `Pay at`;
                this.cards[3].subject = `${response.data.dayDifference} days`;
              }
            }
          });
        }
      },
    });

    this.financesService.getAmountSpendWithCreditCard().subscribe({
      next: (response: HttpResponse) => {
        if (!response.success) return;
        this.cards[3].aditional.push(`${response.data.amount}`);
        this.cards[3].aditional.push(`${response.data.percentage}`);
        this.cards[3].aditional.push(`${response.data.pay}`);
        this.cards[3] = {
          ...this.cards[3],
        };
      },
    });

    // Initialize
    this.configAnimationInputDate();
  }

  public showDetails(id: number) {
    switch (id) {
      case 1:
        this.showIncomes();
        break;
      case 2:
        this.showBills();
        break;
    }
  }
  public changeCard(id: number) {
    switch (id) {
      case 1:
        this.changeCardIncome();
        break;
      case 2:
        this.changeCardBill();
        break;
    }
  }
  private changeCardIncome() {
    let subtitle: string;
    let subject: string;
    this.incomeIndex++;
    switch (this.incomeIndex) {
      case 0:
        subtitle = 'year';
        subject = this.financesService.toMoneyFormat(
          this.incomesPer[this.incomeIndex]
        );
        break;
      case 1:
        subtitle = 'month';
        subject = this.financesService.toMoneyFormat(
          this.incomesPer[this.incomeIndex]
        );
        break;
      case 2:
        subtitle = 'day';
        subject = this.financesService.toMoneyFormat(
          this.incomesPer[this.incomeIndex]
        );
        break;
      default:
        this.incomeIndex = -1;
        this.changeCardIncome();
        return;
    }
    this.cards[0].subtitle = subtitle;
    this.cards[0].subject = subject;
  }
  private changeCardBill() {
    let subtitle: string;
    let subject: string;
    this.billIndex++;
    switch (this.billIndex) {
      case 0:
        subtitle = 'year';
        subject = this.financesService.toMoneyFormat(
          this.billsPer[this.billIndex]
        );
        break;
      case 1:
        subtitle = 'month';
        subject = this.financesService.toMoneyFormat(
          this.billsPer[this.billIndex]
        );
        break;
      case 2:
        subtitle = 'day';
        subject = this.financesService.toMoneyFormat(
          this.billsPer[this.billIndex]
        );
        break;
      default:
        this.billIndex = -1;
        this.changeCardBill();
        return;
    }
    this.cards[1].subtitle = subtitle;
    this.cards[1].subject = subject;
  }
  private showIncomes() {
    this.router.navigate([this.router.url, 'showIncomes']);
  }
  private showBills() {
    this.router.navigate([this.router.url, 'showBills']);
  }
  public openAddSubscriptionForm(): void {
    this.subscriptionModalService.openCreateModal();
  }

  private configAnimationInputDate() {
    const input = document.getElementById('weeklyexpense') as HTMLInputElement;
    function addFocus(this: HTMLInputElement) {
      const parent = this.parentNode as HTMLElement;
      parent.classList.add('focus');
    }
    function removeFocus(this: HTMLInputElement) {
      const parent = this.parentNode as HTMLElement;
      if (this.value == '') {
        parent.classList.remove('focus');
      }
    }
    input.addEventListener('focus', addFocus);
    input.addEventListener('blur', removeFocus);
    input.focus();
    this.weeklyExpense = this.datesService.getNow().split(' ')[0];
  }
}
