import { Component, Input } from '@angular/core';
import { FinancesService } from '../../core/services/finances.service';
import { AddContributionModalService } from '../../../../shared/services/modals/add-contribution-modal.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-debt-graph',
  standalone: true,
  imports: [],
  templateUrl: './debt-graph.component.html',
  styleUrl: './debt-graph.component.scss',
})
export class DebtGraphComponent {
  @Input() id: number = 0;
  @Input() title: string = '';
  @Input({ required: true }) maxValue: number = 0;
  @Input({ required: true }) accumulatedAmount: number = 0;
  subtitle: string = '';

  private ROOT_PATH: string = 'assets/png/percentage.png';

  public dom!: HTMLDivElement;
  public myChart!: echarts.ECharts;
  public option: any;

  constructor(
    private readonly financesService: FinancesService,
    private readonly addContributionModalService: AddContributionModalService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.subtitle = this.financesService.toMoneyFormat(this.maxValue);

      this.dom = document.getElementById(`debt${this.id}`) as HTMLDivElement;

      this.myChart = echarts.init(this.dom, '', {
        renderer: 'canvas',
        useDirtyRect: false,
      });

      const _valOnRadianMax: number = this.maxValue;

      const _insidePanelRadius: number = 50;
      const _innerRadius: number = 60;
      const _outerRadius: number = 70;

      const _panelImageURL: string = this.ROOT_PATH;
      const _animationDuration: number = 1000;
      const _animationDurationUpdate: number = 1000;
      const _animationEasingUpdate: string = 'quarticInOut';

      const _pointerInnerRadius: number = 40;

      function renderItem(params: any, api: any) {
        const valOnRadian = api.value(1);
        const coords = api.coord([api.value(0), valOnRadian]);
        const polarEndRadian = coords[3];
        const imageStyle = {
          image: _panelImageURL,
          x: params.coordSys.cx - _outerRadius,
          y: params.coordSys.cy - _outerRadius,
          width: _outerRadius * 2,
          height: _outerRadius * 2,
        };
        return {
          type: 'group',
          children: [
            {
              type: 'image',
              style: imageStyle,
              clipPath: {
                type: 'sector',
                shape: {
                  cx: params.coordSys.cx,
                  cy: params.coordSys.cy,
                  r: _outerRadius,
                  r0: _innerRadius,
                  startAngle: 0,
                  endAngle: -polarEndRadian,
                  transition: 'endAngle',
                  enterFrom: { endAngle: 0 },
                },
              },
            },
            {
              type: 'image',
              style: imageStyle,
              clipPath: {
                type: 'polygon',
                shape: {
                  points: makePionterPoints(params, polarEndRadian),
                },
                extra: {
                  polarEndRadian: polarEndRadian,
                  transition: 'polarEndRadian',
                  enterFrom: { polarEndRadian: 0 },
                },
                during: function (apiDuring: any) {
                  apiDuring.setShape(
                    'points',
                    makePionterPoints(
                      params,
                      apiDuring.getExtra('polarEndRadian')
                    )
                  );
                },
              },
            },
            {
              type: 'circle',
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _insidePanelRadius,
              },
              style: {
                fill: '#fff',
                shadowBlur: 25,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(76,107,167,0.4)',
              },
            },
            {
              type: 'text',
              extra: {
                valOnRadian: valOnRadian,
                transition: 'valOnRadian',
                enterFrom: { valOnRadian: 0 },
              },
              style: {
                text: makeText(valOnRadian),
                fontSize: 20,
                fontWeight: 700,
                x: params.coordSys.cx,
                y: params.coordSys.cy,
                fill: 'rgb(0,50,190)',
                align: 'center',
                verticalAlign: 'middle',
                enterFrom: { opacity: 0 },
              },
              during: function (apiDuring: any) {
                apiDuring.setStyle(
                  'text',
                  makeText(apiDuring.getExtra('valOnRadian'))
                );
              },
            },
          ],
        };
      }
      function convertToPolarPoint(
        renderItemParams: any,
        radius: any,
        radian: any
      ) {
        return [
          Math.cos(radian) * radius + renderItemParams.coordSys.cx,
          -Math.sin(radian) * radius + renderItemParams.coordSys.cy,
        ];
      }
      function makePionterPoints(
        renderItemParams: any,
        polarEndRadian: any
      ): any {
        return [
          convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
          convertToPolarPoint(
            renderItemParams,
            _outerRadius,
            polarEndRadian + Math.PI * 0.03
          ),
          convertToPolarPoint(
            renderItemParams,
            _pointerInnerRadius,
            polarEndRadian
          ),
        ];
      }
      function makeText(valOnRadian: number): string {
        // Validate additive animation calc.
        if (valOnRadian < -10) {
          alert('illegal during val: ' + valOnRadian);
        }
        return ((valOnRadian / _valOnRadianMax) * 100).toFixed(2) + '%';
      }

      this.option = {
        animationEasing: _animationEasingUpdate,
        animationDuration: _animationDuration,
        animationDurationUpdate: _animationDurationUpdate,
        animationEasingUpdate: _animationEasingUpdate,
        dataset: {
          source: [[1, this.accumulatedAmount]],
        },
        tooltip: {},
        angleAxis: {
          type: 'value',
          startAngle: 0,
          show: false,
          min: 0,
          max: _valOnRadianMax,
        },
        radiusAxis: {
          type: 'value',
          show: false,
        },
        polar: {},
        series: [
          {
            type: 'custom',
            coordinateSystem: 'polar',
            renderItem: renderItem,
          },
        ],
      };

      if (this.option && typeof this.option === 'object') {
        this.myChart.setOption(this.option);
      }

      // setInterval(() => {
      //   var nextSource = [[1, Math.round(Math.random() * _valOnRadianMax)]];
      //   this.myChart.setOption({
      //     dataset: {
      //       source: nextSource
      //     }
      //   });
      // }, 3000);
    }, 500);
  }
}
