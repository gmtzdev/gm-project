import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { FinancesService } from '../../core/services/finances.service';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;
@Component({
  selector: 'app-expensesweek',
  standalone: true,
  imports: [],
  templateUrl: './expensesweek.component.html',
  styleUrl: './expensesweek.component.scss',
})
export class ExpensesweekComponent implements OnInit {
  @ViewChild('mainExpensesWeek')
  mainExpensesWeek!: ElementRef;

  @Input({ required: true })
  date: string = '';

  public myChart!: echarts.ECharts;
  public option: EChartsOption = {};

  private dateFormatter(date: string): string {
    const aux = date.split('-');
    return aux.join('');
  }

  private tooltipDisplay: string = 'Holaa';
  private week: any = {};
  private days: any = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  private months: string[] = [
    '',
    'January',
    'February',
    'Mach',
    'April',
    'May',
    'June',
    'July',
    'Agust',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(private readonly financesService: FinancesService) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['date']) {
      const dateFormatted = this.dateFormatter(changes['date'].currentValue);
      this.getExpensesByWeek(dateFormatted);
    }
  }

  public ngOnInit(): void {
    echarts.use([GridComponent, BarChart, CanvasRenderer]);
    // TODO Use the ElementRef reference to puth the chart
    const chartDom = document.getElementById('mainWeek')!;
    this.myChart = echarts.init(chartDom);
  }

  public getExpensesByWeek(dateFormatted: string) {
    this.financesService.getExpensesByWeek(dateFormatted).subscribe({
      next: (response: HttpResponse) => {
        if (response.success) {
          this.week = response.data.week;
          this.option = {
            tooltip: {
              trigger: 'axis',
              formatter: (params: any) => {
                const day = this.week[this.days[params[0].axisValue]].day;
                const month =
                  this.months[this.week[this.days[params[0].axisValue]].month];
                return (
                  `${month} ${day}<br>` +
                  params[0].marker +
                  '' +
                  params[0].value
                );
              },
              axisPointer: {
                type: 'shadow',
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            color: ['#1ef50d'],
            xAxis: {
              type: 'category',
              data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: response.data.data,
                barWidth: '25%',
                type: 'bar',
              },
            ],
          };

          if (this.option && this.myChart) this.myChart.setOption(this.option);
        }
      },
    });
  }
}
