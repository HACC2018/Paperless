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

  valueBarsChart: any;
  chartData = null;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WasteAuditReportsPage');

    //Go get our data
    this.getData(); 
  }

  getReportValues() {
    let reportByCat = {};

      for (let trans of this.chartData) {
        if (reportByCat[trans.Category]) {
          reportByCat[trans.Category] += +trans.Volume;
        } else {
          reportByCat[trans.Category] = +trans.Volume;
        }
      }
      return reportByCat;
  }
  createCharts(data) {
  this.chartData = data;
  // Calculate Values for the Chart
  let graphData = this.getReportValues();

  // Create the chart
  this.valueBarsChart = new Chart(this.valueBarsCanvas.nativeElement, {
    type: 'bar',
    data: {
        labels: Object.keys(graphData),
        datasets: [{
        data: Object.values(graphData),
        backgroundColor: '#32db64'
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
  updateCharts(data) {
    this.chartData = data;
    let graphData = this.getReportValues();

    // Update our dataset
    this.valueBarsChart.data.datasets.forEach((dataset) => {
      dataset.data = graphData
    });
    this.valueBarsChart.update();
  }
  getData(){
    // Reference to our Firebase List
    this.ref = this.db.list('Audit');
    // Catch any update to draw the Chart
    this.ref.valueChanges().subscribe(result => {
      if (this.chartData) {
        this.updateCharts(result)
      } else {
        this.createCharts(result)
      }
    })
  }
}
