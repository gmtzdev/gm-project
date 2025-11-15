import { Component, OnInit } from '@angular/core';
import { DatesService } from '../../shared/services/global/dates.service';
import { CommonModule } from '@angular/common';
import { Day } from '../../shared/models/calendar/Day.model';
import { DateModalService } from '../../shared/services/modals/date-modal.service';
import { TaskService } from '../../shared/services/global/task.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  week = [
    { day: 'Sunday', con: 'su' },
    { day: 'Monday', con: 'mo' },
    { day: 'Thesday', con: 'th' },
    { day: 'Wendsday', con: 'we' },
    { day: 'Thersday', con: 'th' },
    { day: 'Friday', con: 'fr' },
    { day: 'Saturday', con: 'sa' },
  ];
  items: Day[] = [];

  constructor(
    private datesService: DatesService,
    private taskService: TaskService,
    private dateModalService: DateModalService
  ) {}

  public today: Date = new Date(this.datesService.getNow());
  // public today: Date = new Date('2024-02-15 12:00:00');
  public year: string = '';
  public month: string = '';
  public day: number = 0;

  private xyear: number = -1;
  private xmonth: number = -1;
  private xday: number = -1;

  ngOnInit(): void {
    this.day = this.today.getDate();
    this.month = this.today.toLocaleString('es-MX', { month: 'long' });
    this.year = this.today.getFullYear().toString();

    this.xyear = +this.year;
    this.xmonth = this.today.getMonth();
    this.xday = this.day;

    this.printCalendar(this.xyear, this.xmonth);

    setTimeout(() => {
      this.taskService.setDay.emit(`${this.day} ${this.month.slice(0, 3)}`);
    }, 500);
  }

  public insertTask($event: any, day: number, noDayOfMonth: boolean) {
    let month = this.month;
    if (noDayOfMonth) {
      const swap = day < 15 ? 1 : -1;
      const Month = new Date(+this.year, this.today.getMonth() + swap, 15);
      month = Month.toLocaleString('es-MX', { month: 'long' });
    }
    this.taskService.setDay.emit(`${day} ${month.slice(0, 3)}`);

    const infoOfTarget = $event.target.getBoundingClientRect();
    const x = infoOfTarget.x + infoOfTarget.width / 2;
    const y = infoOfTarget.y + infoOfTarget.height / 2;
    this.dateModalService.animationEmitter.emit({ x: x, y: y, day: day });
  }

  public previousMonth() {
    this.xmonth -= 1;
    if (this.xmonth <= -1) {
      this.xyear -= 1;
      this.xmonth = 11;
    }
    this.printCalendar(this.xyear, this.xmonth);
  }
  public nextMonth() {
    this.xmonth += 1;
    if (this.xmonth >= 12) {
      this.xyear += 1;
      this.xmonth = 0;
    }
    this.printCalendar(this.xyear, this.xmonth);
  }

  // PRIVATE
  private printCalendar(year: number, month: number): void {
    this.items = [];
    const firstDayOfMonth: Date = new Date(`${year}-${month + 1}-01 12:00:00`);
    const previousMonth: Date = new Date(+this.year, month, 0);

    let y = previousMonth.getDate();
    for (let x = firstDayOfMonth.getDay() - 1; x >= 0; x--, y--) {
      const day = new Day(y, month, year);
      day.noDayOfMonth = true;
      this.items.push(day);
    }

    this.items = this.items.reverse();

    let j = 1;
    let i = firstDayOfMonth.getDay();
    for (; j <= this.datesService.getDaysOfMonth(firstDayOfMonth); i++, j++) {
      const cday = new Day(j, month, year);

      if (
        cday.day == this.today.getDate() &&
        cday.month == this.today.getMonth() &&
        cday.year == this.today.getFullYear()
      ) {
        cday.today = true;
      }
      this.items.push(cday);
    }

    let a = 1;
    for (; i < 35; i++, a++) {
      const day = new Day(a, month, year);
      day.noDayOfMonth = true;
      this.items.push(day);
    }

    this.month = firstDayOfMonth.toLocaleString('es-MX', { month: 'long' });
    this.year = firstDayOfMonth.getFullYear().toString();
  }
}
