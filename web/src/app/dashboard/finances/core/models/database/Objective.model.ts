export class Objective {
    id: number;
    objective: string;
    description: string;
    amount: number;
    percentage: number;
    complete: boolean;
    created_at: Date;

    constructor(id: number, objective: string, description: string, amount: number, percentage: number, complete: boolean, created_at: Date) {
        this.id = id;
        this.objective = objective;
        this.description = description;
        this.amount = amount;
        this.percentage = percentage;
        this.complete = complete;
        this.created_at = created_at;
    }
}