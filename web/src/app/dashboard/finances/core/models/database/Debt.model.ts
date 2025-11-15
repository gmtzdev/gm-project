import { DebtPayment } from './DebtPayment.model';

export class Debt {
  public id: number;
  public debt: string;
  public description: string;
  public amount: number;
  public paid: number;
  public percentage: number;
  public complete: boolean;
  public created_at: Date;
  public updated_at: Date;
  public deleted_at: Date;
  public debtPayments: DebtPayment[];

  constructor(debt: Debt) {
    this.id = debt.id;
    this.debt = debt.debt;
    this.description = debt.description;
    this.amount = debt.amount;
    this.paid = debt.paid;
    this.percentage = debt.percentage;
    this.complete = debt.complete;
    this.created_at = debt.created_at;
    this.updated_at = debt.updated_at;
    this.deleted_at = debt.deleted_at;
    this.debtPayments = debt.debtPayments;
  }
}
