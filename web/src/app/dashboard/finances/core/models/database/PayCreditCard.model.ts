export class PayCreditCard {
  id: number;
  payDate: Date;
  pay: boolean;
  created_at: Date;

  constructor(payCreditCard: PayCreditCard) {
    this.id = payCreditCard.id;
    this.payDate = payCreditCard.payDate;
    this.pay = payCreditCard.pay;
    this.created_at = payCreditCard.created_at;
  }
}
