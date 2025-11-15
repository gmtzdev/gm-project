import { Debt } from './Debt.model';

export class Institution {
  id: number;
  name: string;
  location: string;
  debts: Debt[] = [];

  constructor(id: number, name: string, location: string, debts?: Debt[]) {
    this.id = id;
    this.name = name;
    this.location = location;
    if (debts) {
      this.debts = debts;
    }
  }
}
