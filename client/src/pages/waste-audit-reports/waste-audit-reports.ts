import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the WasteAuditReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waste-audit-reports',
  templateUrl: 'waste-audit-reports.html',
})
export class WasteAuditReportsPage {
  data: Observable<any[]>;
  //This is the reference from the database
  ref: any

  transaction = {
    value: 0,
    expense: false,
    month: 0
  }
  @ViewChild('valueBarCanvas') valueBarCanvas;
  @ViewChild('valuePieCanvas') valuePieCanvas;
  @ViewChild('valueLineCanvas') valueLineCanvas;

  backgroundColor =  [
                 'rgba(54, 162, 235, 1)',
                 'rgba(255, 206, 86, 1)',
                 'rgba(255, 99, 132, 1)',
                 'rgba(75, 192, 192, 1)',
                 'rgba(153, 102, 255, 1)',
                 'rgba(255, 159, 64, 1)'
             ];
 borderColor =
        [
           'rgba(54, 162, 235, 1)',
           'rgba(255, 206, 86, 1)',
           'rgba(255,99,132,1)',
           'rgba(75, 192, 192, 1)',
           'rgba(153, 102, 255, 1)',
           'rgba(255, 159, 64, 1)'
       ];

 selectedReport;
 showPie: any = 0;
 showBar: any = 0;
 showLine: any = 0;

  reportByCat;
  valueBarChart: any;
  valuePieChart: any;
  valueLineChart: any;

  chartData = null;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WasteAuditReportsPage');

    //Go get our data
    this.getData();

    //Set up the graphs
    this.selectedReport='All'
    this.graphSelect();
  }
  graphSelect()
  {
    this.showPie = 1;
    this.showBar = 1;
    this.showLine = 1;

    if(this.selectedReport=='Bar'){
      this.showBar = 0;
    }
    else if(this.selectedReport=='Pie'){
      this.showPie = 0;
    }
    else if(this.selectedReport=='Line'){
      this.showLine = 0;
    }
    else{
      this.showPie = 0;
      this.showBar = 0;
      this.showLine = 0;
    }
  }
  getReportValues() {
    this.reportByCat = {};
      for (let trans of this.chartData) {
        if (this.reportByCat[trans.Category]) {
          this.reportByCat[trans.Category] += +trans.Volume;
        } else {
          this.reportByCat[trans.Category] = +trans.Volume;
        }
      }
  }
  createBarCharts()
  {
    let graphData = this.reportByCat;

    // Create the chart
    this.valueBarChart = new Chart(this.valueBarCanvas.nativeElement, {
      type: 'bar',
      data: {
          labels: Object.keys(graphData),
          datasets: [{
          data: Object.keys(graphData).map(key => graphData[key]),
          backgroundColor: this.backgroundColor,
          boarderColor: this.borderColor
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItems, data) {
              return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
            }
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value;
              },
              suggestedMin: 0
            }
          }]
        },
      }
    });
  }
  createLineCharts()
  {
  // Calculate Values for the Chart
  let graphData = this.reportByCat;


  // Create the chart
  this.valueLineChart = new Chart(this.valueLineCanvas.nativeElement, {
    type: 'line',
    data: {
        labels: Object.keys(graphData),
        datasets: [{
        data: Object.keys(graphData).map(key => graphData[key]),
        backgroundColor: this.backgroundColor,
        boarderColor: this.borderColor
      }]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItems, data) {
            return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
          }
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            callback: function (value, index, values) {
              return value;
            },
            suggestedMin: 0
          }
        }]
      },
    }
  });
}
  createPieCharts()
  {
    // Calculate Values for the Chart
    let graphData = this.reportByCat;

    // Create the chart
    this.valuePieChart = new Chart(this.valuePieCanvas.nativeElement, {
      type: 'doughnut',
      data: {
          labels: Object.keys(graphData),
          datasets: [{
          data: Object.keys(graphData).map(key => graphData[key]),
          backgroundColor: this.backgroundColor
        }]
      },
      options: {
        legend: {
          display: true
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItems, data) {
              return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
            }
          }
        }
      }
    });
  }

  getData(){
    // Reference to our Firebase List
    this.ref = this.db.list('Audit');
    // Catch any update to draw the Chart
    this.ref.valueChanges().subscribe(result => {
        this.chartData = result;
        this.getReportValues();

        this.showPie = true;
        this.showBar = true;
        this.showLine = true;

        this.createLineCharts();
        this.createPieCharts();
        this.createBarCharts();

        this.graphSelect();
    })
  }
}
