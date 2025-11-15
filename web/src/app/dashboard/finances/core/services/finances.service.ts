import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatesService } from '../../../../shared/services/global/dates.service';
import { CategoryOptions } from '../interfaces/categoryOptions';

// Model
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

// Dto
import { CreateBillDto } from '../dto/bill/create-bill.dto';
import { CreateIncomeDto } from '../dto/income/create-icome.dto';
import { CreateCategoryDto } from '../dto/category/create-category.dto';
import { CreateInstitutionDto } from '../dto/institution/create-institution.dto';
import { UpdateBillDto } from '../dto/bill/update-bill.dto';
import { ContributionDto } from '../dto/contribution/create-contribution.dto';
import { environment } from '../../../../../environment/environment';
import { CreateSubscriptionDto } from '../dto/subscription/create-subscription.dto';

@Injectable({
  providedIn: 'root',
})
export class FinancesService {
  private URL: string = `${environment.serever}:${environment.port}/finances`;

  constructor(private http: HttpClient, private datesService: DatesService) {}

  // General
  public getBillsInFormat(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getBillsInFormat`);
  }
  public getIncomesPer(): Observable<HttpResponse> {
    const date = this.datesService.getDate();
    return this.http.get<HttpResponse>(`${this.URL}/getIncomesPer/${date}`);
  }
  public getBillsPer(): Observable<HttpResponse> {
    const date = this.datesService.getDate();
    return this.http.get<HttpResponse>(`${this.URL}/getBillsPer/${date}`);
  }
  public getTopOneCategory(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getTopOneCategory`);
  }
  public getCurrentDatePayCreditCard(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${this.URL}/getCurrentDatePayCreditCard`
    );
  }
  public getDaysToPayCreditCard(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getDaysToPayCreditCard`);
  }
  public getDaysToCutOffCreditCard(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getDaysToCutOffCreditCard`);
  }
  public getAmountSpendWithCreditCard(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(
      `${this.URL}/getAmountSpendWithCreditCard`
    );
  }
  public getIncomesVsBills(year: number): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getIncomesVsBills/${year}`);
  }
  public getNoCompleteObjectives(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getNoCompleteObjectives`);
  }
  public getIncomes(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getIncomes`);
  }
  public getBills(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getBills`);
  }
  public getCategoriesToGraphic(
    options: CategoryOptions
  ): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${this.URL}/getCategoriesToGraphic`, {
      options,
    });
  }
  public getNoCompleteDebts(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/getNoCompleteDebts`);
  }
  public getExpensesByWeek(dateFormatted: string): Observable<HttpResponse> {
    const options = {
      params: new HttpParams().set('date', dateFormatted),
    };
    return this.http.get<HttpResponse>(
      `${this.URL}/getExpensesByWeek`,
      options
    );
  }
  public passToNextMonthCreditCard(): Observable<HttpResponse>{
    return this.http.post<HttpResponse>(`${this.URL}/passToNextMonthCreditCard`, {});
  }

  // Income
  public saveIncome(income: CreateIncomeDto): Observable<HttpResponse> {
    income = new CreateIncomeDto(
      income.concept,
      income.amount,
      income.origin,
      income.created_at
    );
    return this.http.post<HttpResponse>(`${this.URL}/income`, { income });
  }

  // Bill
  public saveBill(bill: CreateBillDto): Observable<HttpResponse> {
    bill = new CreateBillDto(bill);
    return this.http.post<HttpResponse>(`${this.URL}/bill`, { bill });
  }
  public getBill(id: number): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/bill/${id}`);
  }
  public updateBill(bill: UpdateBillDto): Observable<HttpResponse> {
    bill = new UpdateBillDto(bill);
    bill.updated_at = new Date(this.datesService.getNow());
    console.log(bill);
    return this.http.patch<HttpResponse>(`${this.URL}/bill/${bill.id}`, {
      bill,
    });
  }

  // Origin
  public getOrigins(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/origin`);
  }

  // Category
  public getCartegories(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/category`);
  }
  public saveCategory(category: CreateCategoryDto): Observable<HttpResponse> {
    category = new CreateCategoryDto(category.name);
    return this.http.post<HttpResponse>(`${this.URL}/category`, { category });
  }

  // Payment
  public getPayments(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/payment`);
  }

  // Institution
  public getInstitutions(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/institution`);
  }
  public getInstitutionsWithDebts(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/institution/withDebts`);
  }
  public saveInstitution(
    institution: CreateInstitutionDto
  ): Observable<HttpResponse> {
    institution = new CreateInstitutionDto(institution.name);
    return this.http.post<HttpResponse>(`${this.URL}/institution`, {
      institution,
    });
  }

  // Card
  public getCards(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/card`);
  }

  // Contribution
  public saveContribution(
    contribution: ContributionDto
  ): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(
      `${this.URL}/contribution`,
      contribution
    );
  }


  // Subscription
  public createSubscription(subscription: CreateSubscriptionDto): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${this.URL}/subscription`, subscription);
  }
  public getSubscriptions(): Observable<HttpResponse> {
    return this.http.get<HttpResponse>(`${this.URL}/subscription`);
  }

  // Utils
  public toMoneyFormat(amount: number): string {
    const a = amount.toString();
    let aux: string[] = [];
    let money: string = '$';
    const long: number = a.length;
    const includesPoint: boolean = a.includes('.');

    let i = 1;
    if (includesPoint)
      for (i = 1; i <= long; i++) {
        aux.push(a[long - i]);
        if (a[long - i] == '.') {
          i++;
          break;
        }
      }

    for (let j = i; j <= long; j++) {
      aux.push(a[long - j]);
      if ((j - i + 1) % 3 === 0 && j + 1 <= long) aux.push(',');
    }

    aux = aux.reverse();
    money += aux.join('');
    return money;
  }
}
