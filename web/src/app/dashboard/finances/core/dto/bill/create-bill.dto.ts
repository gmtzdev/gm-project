import { Card } from '../../models/database/Card.model';
import { Category } from '../../models/database/Category.model';
import { Debt } from '../../models/database/Debt.model';
import { Institution } from '../../models/database/Institution.model';
import { Payment } from '../../models/database/Payment.model';

export class CreateBillDto {
  concept: string;
  amount: number;
  visible: boolean = true;
  category: Category;
  payment: Payment;
  card: Card;
  institution: Institution;
  debt?: Debt;
  created_at: Date;

  constructor(bill: CreateBillDto) {
    this.concept = bill.concept;
    this.amount = bill.amount;
    this.category = bill.category;
    this.payment = bill.payment;
    this.card = bill.card;
    this.institution = bill.institution;
    if (bill.debt) {
      this.debt = bill.debt;
    }
    this.created_at = bill.created_at;
  }
}
