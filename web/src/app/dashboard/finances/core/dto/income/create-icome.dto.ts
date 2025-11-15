import { Origin } from '../../models/database/Origin.model';

export class CreateIncomeDto {
  concept: string;
  amount: number;
  visible: boolean = true;
  origin: Origin;
  created_at: Date;

  constructor(
    concept: string,
    amount: number,
    origin: Origin,
    created_at: Date
  ) {
    this.concept = concept;
    this.amount = amount;
    this.origin = origin;
    this.created_at = created_at;
  }
}
