import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';

import moment from 'moment';

/**
 * Generated class for the AuditDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-audit-detail',
  templateUrl: 'audit-detail.html',
})
export class AuditDetailPage {
  selectedItem: any;

  currentWeight: string;
  currentVolume: string;

  public items: Array<{ Category: string, Date: string
                      , Location: string, Volume: string
                      , Weight: string
                     }> = [];
  public rows: Array<{ labelVol: string, labelWeight: string, binLabel: string }> = [];

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private geoLoc : Geolocation
              , private afd : AngularFireDatabase
            )
  {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.loadData();
  }
  addBag(){
    var volumnToAdd = ((this.currentVolume === undefined) ? '0' : this.currentVolume);
    var WeightToAdd = ((this.currentWeight === undefined) ? '0' : this.currentWeight);
    this.saveAuditData(this.selectedItem.Name, volumnToAdd, WeightToAdd);
    //Empty this out
    this.currentVolume = '';
    this.currentWeight = '';
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AuditDetailPage');
  }
  filterOutData(loadedData)
  {
    this.items = loadedData
  }
  loadData(){
    this.afd.list('Audit')
      //this.afd.list('Audit', ref => ref.equalTo('Starbucks cup'))
        .valueChanges().subscribe
        (
          data =>
          {
            console.log("Getting Audit data");
            this.filterOutData(data);
          }

        );

  }

  saveAuditData(categoryName, volumnToAdd, WeightToAdd){
    var newBin = {
      Category: categoryName,
      Date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
      Location: '',
      Volume: volumnToAdd,
      Weight: WeightToAdd,
    };

    //Getting location can take some time so we need to wait
    this.geoLoc.getCurrentPosition().then((position) => {
        newBin.Location = position.coords.latitude + ':' + position.coords.longitude;
        console.log('My location: ', newBin.Location);
        this.afd.list("Audit").push(newBin);
      });
  }
}
