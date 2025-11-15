import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { FinancesService } from '../../core/services/finances.service';
import { lastValueFrom } from 'rxjs';
import { CategoryGraphic } from '../../core/models/CategoryGraphic.model';
import { CommonModule } from '@angular/common';
import { MoneyFormatPipe } from '../../../../shared/pipes/MoneyFormat.pipe';
import { TimeAgoPipe } from '../../../../shared/pipes/TimeAgo.pipe';

@Component({
  selector: 'app-billscategory',
  standalone: true,
  imports: [CommonModule, MoneyFormatPipe, TimeAgoPipe],
  templateUrl: './billscategory.component.html',
  styleUrl: './billscategory.component.scss',
})
export class BillscategoryComponent implements OnInit {
  public dom!: HTMLDivElement;
  public myChart!: echarts.ECharts;
  public option!: echarts.EChartsCoreOption;
  public myData: CategoryGraphic[] = [];

  constructor(private readonly financesService: FinancesService) {}

  ngOnInit(): void {
    setTimeout(async () => {
      // Obtiene la referencia al DOM
      const dom = document.getElementById('chart-container');

      const myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false,
      });

      const response = await lastValueFrom(
        this.financesService.getCategoriesToGraphic({
          year: new Date().getFullYear(),
          all: false,
        })
      );

      let myData: CategoryGraphic[] = [];
      if (response.success) {
        const aux = response.data as CategoryGraphic[];
        myData = [...aux];
        this.myData = aux.reverse();
      }

      this.option = {
        // tooltip: {
        //   trigger: 'item'
        // },
        // legend: {
        //   top: '5%',
        //   left: 'center'
        // },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,

            // Las barras
            itemStyle: {
              borderRadius: 10,
              // borderColor: '#000',
              borderWidth: 1,
            },

            label: {
              show: false,
              position: 'center',
            },

            // Texto del centro
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold',
              },
            },

            labelLine: {
              show: false,
            },

            data: myData,
          },
        ],
      };

      if (this.option && typeof this.option === 'object') {
        myChart.setOption(this.option);
      }

      // window.addEventListener('resize', myChart.resize);
    }, 600);
  }

  private async initializer() {}
}
