import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {Label} from 'ng2-charts';
import {DateService} from '../services/date.service';

@Component({
  selector: 'app-statistics-all',
  templateUrl: './statistics-all.component.html',
  styleUrls: ['./statistics-all.component.scss']
})
export class StatisticsAllComponent implements OnInit {
  users = undefined;
  total = {1: 0, 2: 0};

  title = 'app';
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [pluginDataLabels];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    // maintainAspectRatio: false,
    legend: {
      position: 'top',
      labels: {
        boxWidth: 20,
        fontSize: 11
      },
    },
    plugins: {
      // datalabels: {
      //   formatter: (value, ctx) => {
      //     // const label = ctx.chart.data.labels[ctx.dataIndex];
      //     // return label;
      //     return '';
      //   },
      // },
    }
  };
  public pieChartColors = [{
    backgroundColor: [
      'rgba(27, 47, 72, 1.0)',
      'rgba(27, 47, 72, 0.8)',
      'rgba(27, 47, 72, 0.6)',
      'rgba(27, 47, 72, 0.4)',
      'rgba(27, 47, 72, 0.2)',
      'rgba(130, 29, 47, 1.0)',
      'rgba(130, 29, 47, 0.8)',
      'rgba(130, 29, 47, 0.6)',
      'rgba(130, 29, 47, 0.4)',
      'rgba(130, 29, 47, 0.2)',
    ]
  }];


  public barChartOptions: ChartOptions = {
    responsive: true,

    // We use these empty structures as placeholders for dynamic theming.
    scales: {xAxes: [{stacked: true}], yAxes: [{stacked: true}]},
    legend: {
      position: 'top',
      labels: {
        boxWidth: 20
      }
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        display: false
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {data: [], label: ''},
  ];

  constructor(private apiService: ApiService,
              private dateService: DateService) {
  }

  ngOnInit() {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
      this.loadCharts();
    });
  }

  loadCharts() {
    const allDataEntries = {1: {}, 2: {}};
    const allDataByDay = {1: {}, 2: {}};
    const newBarChartLabels = [];

    for (let i = 1; i <= 2; ++i) {
      this.users.forEach((user) => {
        allDataEntries[i][user.id] = 0;
      });
    }

    const startDate = new Date(2019, 8, 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    while (startDate <= endDate) {
      const d = this.dateService.formatDate(startDate);
      newBarChartLabels.push(d);

      for (let i = 1; i <= 2; ++i) {
        allDataByDay[i][d] = {};

        this.users.forEach((user) => {
          allDataByDay[i][d][user.id] = 0;
        });
      }
      startDate.setDate(startDate.getDate() + 1);
    }

    this.apiService.getActivities(undefined, undefined, this.dateService.startDateStats).subscribe((data) => {
      // @ts-ignore
      data.forEach((obj) => {
        allDataEntries[obj.type_id][obj.user_id] += Number(obj.sum);
        allDataByDay[obj.type_id][this.dateService.formatDate(new Date(obj.date))][obj.user_id] += Number(obj.sum);
        this.total[obj.type_id] += Number(obj.sum);
      });

      const totalAll = this.total[1] + this.total[2];

      this.pieChartLabels = [];
      this.pieChartData = [];

      for (let i = 2; i >= 1; --i) {
        this.users.forEach((user) => {
          this.pieChartLabels.push(user.name + ' (' + (100 * allDataEntries[i][user.id] / totalAll).toFixed(1) + '%)');
          this.pieChartData.push(allDataEntries[i][user.id]);
        });
      }

      this.barChartLabels = newBarChartLabels;
      this.barChartData = [];
      let idx = 0;

      for (let i = 2; i >= 1; --i) {
        this.users.forEach((user) => {
          const userData = [];
          const userLabel = user.name;

          for (let j = 0; j <= newBarChartLabels.length; ++j) {
            try {
              userData.push(allDataByDay[i][newBarChartLabels[j]][user.id]);
            } catch (error) {
            }
          }

          const clr = this.pieChartColors[0].backgroundColor[idx];
          this.barChartData.push({data: userData, label: userLabel, backgroundColor: clr, fill: clr, borderColor: clr});
          // console.log({data: userData, label: userLabel, backgroundColor: this.pieChartColors[0].backgroundColor[idx]});
          idx++;
        });
      }
    });
  }
}
