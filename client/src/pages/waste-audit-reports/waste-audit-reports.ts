import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database/interfaces'

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
  ref: AngularFireList<any>;

  transaction = {
    value: 0,
    expense: false,
    month: 0
  }
  @ViewChild('valueBarsCanvas') valueBarsCanvas;
  @ViewChild('valuePieCanvas') valuePieCanvas;

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
  reportByCat;
  valueBarsChart: any;
  valuePieChart: any;
  chartData = null;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WasteAuditReportsPage');

    //Go get our data
    this.getData();

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
  createLineCharts() {
  // Calculate Values for the Chart
  let graphData = this.reportByCat;

  // Create the chart
  this.valueBarsChart = new Chart(this.valueBarsCanvas.nativeElement, {
    type: 'bar',
    data: {
        labels: Object.keys(graphData),
        datasets: [{
        data: Object.values(graphData),
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
              return value + '$';
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
          data: Object.values(graphData),
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
        this.createLineCharts();
        this.createPieCharts();
    })
  }
}
