import { Card } from '../../models/database/Card.model';
import { Category } from '../../models/database/Category.model';
import { Institution } from '../../models/database/Institution.model';
import { Payment } from '../../models/database/Payment.model';

export class UpdateBillDto {
  id: number;
  concept: string;
  amount: number;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
  category: Category;
  payment: Payment;
  card: Card;
  institution: Institution;

  constructor(bill: UpdateBillDto) {
    this.id = bill.id;
    this.concept = bill.concept;
    this.amount = bill.amount;
    this.visible = bill.visible;
    this.category = bill.category;
    this.payment = bill.payment;
    this.card = bill.card;
    this.institution = bill.institution;
    this.created_at = bill.created_at;
    this.updated_at = bill.updated_at;
  }
}
