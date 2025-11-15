import { Component, OnInit } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { FinancesService } from '../../core/services/finances.service';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

@Component({
  selector: 'app-billsgraphic',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './billsgraphic.component.html',
  styleUrl: './billsgraphic.component.scss',
})
export class BillsgraphicComponent implements OnInit {
  view: [number, number] = [800, 300];

  multi: NgxChartsLineChartFormat[] = [
    {
      name: 'Bills',
      series: [],
    },
  ];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Amount';
  timeline: boolean = true;

  colorScheme: Color = {
    domain: ['#1ef50d', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
    name: 'MyColors',
    selectable: false,
    group: ScaleType.Linear,
  };

  constructor(private financesService: FinancesService) {
    console.log(this.colorScheme.toString());
  }

  ngOnInit(): void {
    this.initializer();
  }

  private async initializer() {
    this.financesService
      .getBillsInFormat()
      .subscribe((billsResponse: HttpResponse) => {
        if (billsResponse.success) {
          const [data] = this.multi;
          const newData: NgxChartsLineChartSeries[] = [];
          for (const s of billsResponse.data.data.series) {
            const name = new Date(s.name);
            const value = s.value;
            newData.push({ name, value } as NgxChartsLineChartSeries);
          }
          this.multi[0].series = data.series.concat(newData);
          this.multi = [...this.multi];
        }
      });
  }

  // TODO I will find a functionality for this functions
  // onSelect(data: any): void {
  //   console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  // }

  // onActivate(data: any): void {
  //   console.log('Activate', JSON.parse(JSON.stringify(data)));
  // }

  // onDeactivate(data: any): void {
  //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  // }
}

interface NgxChartsLineChartSeries {
  name: Date;
  value: number;
}
interface NgxChartsLineChartFormat {
  name: string;
  series: NgxChartsLineChartSeries[];
}
