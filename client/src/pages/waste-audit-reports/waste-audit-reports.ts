import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { FileTransfer   } from '@ionic-native/file-transfer';

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
  GPSTestdifference=10;

  data: Observable<any[]>;

  locationData = [];
  //This is the reference from the database
  ref: any
  //Data grouped by category
  reportByCat;
  //All the data
  chartData = null;

  //List of canvasas to use
  @ViewChild('valueBarCanvas') valueBarCanvas;
  @ViewChild('valuePieCanvas') valuePieCanvas;

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

 //This is the report that is selected by the radio buttons
 selectedReport;
 showPie: any = 0;
 showBar: any = 0;

  valueBarChart: any;
  valuePieChart: any;

  selectFilterDates: any = "";
  selectFilterLocation: any = "";
  selectedValueFilter: any = "";

  filterDates;
  filterLocation;

  constructor(public navCtrl: NavController
    , private afd: AngularFireDatabase
    , private transfer: FileTransfer
    , private plt: Platform
    , private file: File
  ) {
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

    if(this.selectedReport=='Bar'){
      this.showBar = 0;
    }
    else if(this.selectedReport=='Pie'){
      this.showPie = 0;
    }
    else{
      this.showPie = 0;
      this.showBar = 0;
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
    this.ref = this.afd.list('Audit');
    // Catch any update to draw the Chart
    this.ref.valueChanges().subscribe(result => {
        this.chartData = result;
        this.getReportValues();
    })
  }
  convertLocationName(lat1, long1){
    for(let currentRow of this.locationData){

      var lat2, long2, dist;
      var x: any = currentRow;

      dist = this.GPSTestdifference+1;

      lat2 = x.Lat;
      long2 = x.Long;

      //// TODO: Make this calculation a little more better
      dist = Math.abs(parseFloat(lat1)-parseFloat(lat2))
              + Math.abs(parseFloat(long1)-parseFloat(long2));

      if(dist < this.GPSTestdifference){
        return x.Name;
      }
    }
  }
  getReportValues() {
    this.afd.list('Location').valueChanges().subscribe(
      data=>
      {
        this.reportByCat = {};
        this.filterDates = [];
        this.filterLocation =[];

        var currentRow:any;
        for(currentRow of data)
        {
          this.locationData.push
          ({
              Name: currentRow.AuditLocationName,
              Lat: currentRow.AuditLocationLat,
              Long: currentRow.AuditLocationLong,
          });
        }


        for (let trans of this.chartData) {
          //Get the things to filter by
          if("Location" in trans){
            var placeName = this.convertLocationName(trans.Lat, trans.Long);
            if(!this.filterLocation.includes(placeName)){
              this.filterLocation.push(placeName);
            }
          }
          var cleanDate = moment(trans.Date).format('MM/DD/YYYY');
          if(!this.filterDates.includes(cleanDate)){
            this.filterDates.push(cleanDate);
          }
        }

        this.reportByCat =
                      this.chartData
                      .map((row) =>
                        {
                          row.Date =  moment(row.Date).format('MM/DD/YYYY');
                          row.Location = this.convertLocationName(row.Lat, row.Long);
                          return row;
                        })
                      .filter((row) =>
                        {
                          if(
                              ((this.selectFilterLocation.indexOf(row.Location) >= 0)
                                || this.selectFilterLocation == "")
                            && ((
                              this.selectFilterDates.indexOf(row.Date) >= 0)
                                || this.selectFilterDates == "")
                            )
                            return true;
                          return false;
                        })
                      .map((row) =>
                        {
                          var value = 0;
                          if(this.selectedValueFilter=="Volume")
                            value = parseInt(row.Volume);
                          else if(this.selectedValueFilter=="Weight")
                            value = parseInt(row.Weight);
                          else{
                            this.selectedValueFilter="Weight";
                          }

                          let rowSubset = {
                            Category: row.Category,
                            reportValue: value
                          };

                          return rowSubset;
                        })
                      .reduce( (aggroData, row) =>
                        {
                          if (aggroData[row.Category])
                            {
                              aggroData[row.Category] += row.reportValue;
                            }
                            else
                            {
                              aggroData[row.Category] = row.reportValue;
                            }
                          return aggroData ;
                        }, {})
                        ;
        this.showPie = true;
        this.showBar = true;

        this.createPieCharts();
        this.createBarCharts();

        this.graphSelect();
      }
    );
  }
  onChange(){
    this.getReportValues();
  }
  public createOutputFile() {
    let path = "";
/*
    if(this.plt.is('ios')){
      path = this.file.documentsDirectory;
    }else{
      path = "C:\\Test\\text.txt";
      //path = this.file.dataDirectory;
    }
    path = "C:\\Test\\text.txt";
    console.log("here is the path: ") + path;
    const transfer = this.transfer.create();
    transfer.download("test output", path + 'testoutput.txt').then(entry =>{
      let url = entry.toURL();
    });*/

    this.createAccessLogFileAndWrite("Hello World - someEventFunc was called");


  }


    createAccessLogFileAndWrite(text: string) {
    /*  console.log(this.file.dataDirectory);
        //this.file.checkFile("C:\\", 'access.log')
        //this.file.checkFile(this.file.dataDirectory, 'access.log')
        .then(doesExist => {
            console.log("doesExist : " + doesExist);
            return this.writeToAccessLogFile(text);
        }).catch(err => {
            return this.file.createFile(this.file.dataDirectory, 'access.log', false)
                .then(FileEntry => this.writeToAccessLogFile(text))
                .catch(err => console.log('Couldn create file'));
        });*/
    }
    writeToAccessLogFile(text: string) {
           this.file.writeFile(this.file.dataDirectory, 'access.log', text)
       }


}
