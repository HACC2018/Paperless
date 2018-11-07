import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the WasteAuditButtonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waste-audit-button',
  templateUrl: 'waste-audit-button.html',
})

export class WasteAuditButtonPage {
  //This is the reference from the database
  ref: any
  //Data grouped by category
  buttonData = null;
  SelectedButton=null;
    //List of canvasas to use
    @ViewChild('valueButtonCanvas') valueButtonCanvas;

    backgroundColor =  [
                   'rgba(54, 162, 235, 1)',
                   'rgba(255, 206, 86, 1)',
                   'rgba(255, 99, 132, 1)',
                   'rgba(75, 192, 192, 1)',
                   'rgba(153, 102, 255, 1)',
                   'rgba(255, 159, 64, 1)'];
   borderColor =      [
             'rgba(54, 162, 235, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(255,99,132,1)',
             'rgba(75, 192, 192, 1)',
             'rgba(153, 102, 255, 1)',
             'rgba(255, 159, 64, 1)'];

  valueButtonChart: any;

  constructor(public navCtrl: NavController
    , private plt: Platform
    , private afd: AngularFireDatabase
    , public navParams: NavParams
  ) {
    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WasteAuditButtonPage');
  }
  createButtonGraph()
  {
    // Create the chart
    this.valueButtonChart = new Chart(this.valueButtonCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: Object.keys(this.buttonData),
        datasets:
        [
          {
            label: "Live Button",
            fill: false,
            backgroundColor: this.backgroundColor,
            boarderColor: this.borderColor,
            borderCapStyle: 'butt',
            data: Object.keys(this.buttonData).map(key => this.buttonData[key])
          },
          {
            label: "Simulated button",
            fill: false,
            backgroundColor: ['red'],
            boarderColor: ['red'],
            borderCapStyle: 'butt',
            data: Object.keys(this.buttonData).map(key => this.buttonData[key] - 1 + Math.round(Math.random()*3))
          }
        ]
      },
      options:{
        legend:{
          display: false
        },
        tooltips:{
          enabled: true
        },
        scales:{
          yAxes:[{
            scaleLabel:{
              display: true,
              labelString: 'Number of clicks'
            },
            ticks:{
              min: 0,
              stepSize:1
            }
          }],
          xAxes:[{
            scaleLabel:{
              display: true,
              labelString: 'Seconds of time'
            }
          }]
        }
      }
    });
  }
  getData(){
    // Reference to our Firebase List
    this.ref = this.afd.list('Button_Clicks');
    // Catch any update to draw the Chart
    this.ref.valueChanges().subscribe(result => {
        this.buttonData = result;
        this.getReportValues();
    })
  }
  getReportValues() {
    this.buttonData =
                  this.buttonData
                  .map((row) =>
                    {
                      //button clicks per second
                      row = (row - 28800);
                      return row;
                    })
                  .reduce( (aggroData, row) =>
                    {
                      if (aggroData[row])
                        {
                          aggroData[row] += 1;
                        }
                        else
                        {
                          aggroData[row] = 1;
                        }

                        return aggroData ;
                    }, {})
                    ;
                    console.log(this.buttonData);

        this.createButtonGraph();
  }

}
