export class CategoryGraphic {
    id: number;
    name: string;
    lastBillDate: Date;
    icon: string;
    value: number = 0;


    constructor(id: number, name: string, lastBillDate: Date, icon: string) {
        this.id = id;
        this.name = name;
        this.lastBillDate = lastBillDate;
        this.icon = icon;
    }
}