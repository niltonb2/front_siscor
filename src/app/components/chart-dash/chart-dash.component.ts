import { Component, OnDestroy, OnInit } from '@angular/core';
import { colors } from 'app/colors.const';
import { DashboardService } from 'app/main/home/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-dash',
  templateUrl: './chart-dash.component.html',
  styleUrls: ['./chart-dash.component.scss']
})
export class ChartDashComponent implements OnInit, OnDestroy {

  qtdeCobPago: number = 0;
  qtdeCobAberto: number = 0;
  qtdeCobPendente: number = 0;
  qtdeCobVencido: number = 0;

  subs: Subscription[] = [];

  // Color Variables
  private warningColorShade = '#ffe802';
  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private lineChartSuccess = '#28c76f';
  private lineChartWarning = '#ff9f43';
  private lineChartSecondary = '#82868b';
  private lineChartDanger = '#ea5455';
  private labelColor = '#6e6b7b';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout

  public lineChart = {
    chartType: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: false,
      hover: {
        mode: 'label'
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            gridLines: {
              display: true,
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            },
            ticks: {
              fontColor: this.labelColor
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              stepSize: 5,
              min: 0,
              max: 50,
              fontColor: this.labelColor
            },
            gridLines: {
              display: true,
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            }
          }
        ]
      },
      layout: {
        padding: {
          top: -15,
          bottom: -25,
          left: -15
        }
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 25,
          boxWidth: 9
        }
      }
    },

    labels: ['Período'],
    datasets: [
      {
        data: [],
        label: 'Pago',
        borderColor: this.lineChartSuccess,
        lineTension: 0.5,
        pointStyle: 'circle',
        backgroundColor: this.lineChartSuccess,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: this.lineChartSuccess,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointBorderColor: 'transparent',
        pointHoverBorderColor: colors.solid.white,
        pointHoverBackgroundColor: this.lineChartSuccess,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: this.tooltipShadow
      },
      {
        data: [],
        label: 'Em Aberto',
        borderColor: this.lineChartWarning,
        lineTension: 0.5,
        pointStyle: 'circle',
        backgroundColor: this.lineChartWarning,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: this.lineChartWarning,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointBorderColor: 'transparent',
        pointHoverBorderColor: colors.solid.white,
        pointHoverBackgroundColor: this.lineChartWarning,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: this.tooltipShadow
      },
      {
        data: [],
        label: 'Pendente',
        borderColor: this.lineChartSecondary,
        lineTension: 0.5,
        pointStyle: 'circle',
        backgroundColor: this.lineChartSecondary,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: this.lineChartSecondary,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointBorderColor: 'transparent',
        pointHoverBorderColor: colors.solid.white,
        pointHoverBackgroundColor: this.lineChartSecondary,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: this.tooltipShadow
      },
      {
        data: [],
        label: 'Vencido',
        borderColor: this.lineChartDanger,
        lineTension: 0.5,
        pointStyle: 'circle',
        backgroundColor: this.lineChartDanger,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: this.lineChartDanger,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointBorderColor: 'transparent',
        pointHoverBorderColor: colors.solid.white,
        pointHoverBackgroundColor: this.lineChartDanger,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: this.tooltipShadow
      }
    ]
  };

  public plugins = [
    {
      beforeInit(chart) {
        chart.legend.afterFit = function () {
          this.height += 20;
        };
      }
    }
  ];

  constructor(
    private dashboardService: DashboardService
  ) { }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.inicializar();
  }

  inicializar(){
    let sub = this.dashboardService.dadosCobrancaDashboard.subscribe({
      next: cobs => {
        cobs.pagos.forEach(cob => {
          if (!this.lineChart.labels.includes(cob.created_at)) this.lineChart.labels.push(cob.created_at)
          if (cob.status == 'pago') this.qtdeCobPago += 1;
        })
        this.lineChart.datasets[0].data.push(this.qtdeCobPago)

        cobs.abertos.forEach(cob => {
          if (!this.lineChart.labels.includes(cob.created_at)) this.lineChart.labels.push(cob.created_at)
          if (cob.status == 'aberto') this.qtdeCobAberto += 1;
        })
        this.lineChart.datasets[1].data.push(this.qtdeCobAberto)

        cobs.pendentes.forEach(cob => {
          if (!this.lineChart.labels.includes(cob.created_at)) this.lineChart.labels.push(cob.created_at)
          if (cob.status == 'pendente') this.qtdeCobPendente += 1;
        })
        this.lineChart.datasets[2].data.push(this.qtdeCobPendente)

        cobs.vencidos.forEach(cob => {
          if (!this.lineChart.labels.includes(cob.created_at)) this.lineChart.labels.push(cob.created_at)
                  if (cob.status == 'vencido') this.qtdeCobVencido += 1;
        })
        this.lineChart.datasets[3].data.push(this.qtdeCobVencido)
      }
    })

    this.subs.push(sub)
  }

}
