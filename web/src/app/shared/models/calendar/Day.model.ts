export class Day {
    day: number;
    month: number;
    year: number;
    today: boolean;
    noDayOfMonth: boolean;

    constructor(day: number, month: number, year: number) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.today = false;
        this.noDayOfMonth = false;
    }
}