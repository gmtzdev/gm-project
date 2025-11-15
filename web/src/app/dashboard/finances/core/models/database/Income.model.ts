import { Origin } from './Origin.model';

export class Income {
  id: number;
  concept: string;
  amount: number;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
  origin: Origin;

  constructor(
    id: number,
    concept: string,
    amount: number,
    visible: boolean,
    create_at: Date,
    updated_at: Date,
    origin: Origin
  ) {
    this.id = id;
    this.concept = concept;
    this.amount = amount;
    this.visible = visible;
    this.created_at = create_at;
    this.updated_at = updated_at;
    this.origin = origin;
  }
}
