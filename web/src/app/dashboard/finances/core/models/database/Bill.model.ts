import { Card } from "./Card.model";
import { Category } from "./Category.model";
import { Institution } from "./Institution.model";
import { Payment } from "./Payment.model";

export class Bill {
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

    constructor(bill: any) {
        this.id = bill.id
        this.concept = bill.concept
        this.amount = bill.amount
        this.visible = bill.visible
        this.created_at = bill.created_at
        this.updated_at = bill.updated_at
        this.category = bill.category
        this.payment = bill.payment
        this.card = bill.card
        this.institution = bill.institution
    }
}