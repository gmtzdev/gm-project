import { Bill } from '../models/database/Bill.model';

export class BillMetrics{
    private bills: Bill[];

    public total: number = 0;
    public sum: number = 0;
    public average: number = 0;

    constructor(_bills: Bill[]){
        this.bills = _bills;
        this.calculateMetrics();
    }

    private calculateMetrics(){
        this.total = this.calculateTotal();
        this.sum = this.calculateSum();
        this.average = this.calculateAverage();
    }

    private calculateTotal(): number{
        return this.bills.length;
    }

    private calculateSum(): number{
        let acumm: number = 0;
        for(let b of this.bills){
            acumm += b.amount;
        }
        return acumm;
    }

    private calculateAverage(): number{
        return this.sum / this.total;
    }

}