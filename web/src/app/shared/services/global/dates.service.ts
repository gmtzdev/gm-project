import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatesService {
  constructor() {}

  public getDate(): string {
    const date: string = new Date()
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/ /g, '')
      .slice(0, 10)
      .replaceAll('.', '-');
    return date;
  }

  public getNow() {
    const newToday: string = this.getDate();
    const date = new Date();
    const localTime =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return `${newToday} ${localTime}`;
  }

  public getDaysOfMonth(date: Date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    const nextMonth = new Date(year, month + 1, 1);
    const lastDateOfMonth = new Date(year, nextMonth.getMonth(), 0);

    const day = lastDateOfMonth.getDate();

    return day;
  }
} //yyyy-MM-ddThh:mm
