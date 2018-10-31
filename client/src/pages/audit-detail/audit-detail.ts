import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

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
  private maxQuantity: number = 20;
  private currentBin: number = 0 ;

  private currentWeight: number = 0;
  private currentVolume: number = 0;

  public items: Array<{ Category: string, Date: string
                      , Location: string, Volume: string
                      , Weight: string
                     }> = [];
  public rows: Array<{ labelVol: string, labelWeight: string, binLabel: string }> = [];

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private afd : AngularFireDatabase
            )
  {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.loadData();
    //<div  *ngIf="{{selectedItem.Name}}={{item.Name}}">

  }
  addBag(){
    var newBin;
    var timestamp = moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

    newBin.Category = this.selectedItem.Name;
    newBin.Date = timestamp;
    newBin.Location = 'UHM';
    newBin.Volume = this.currentVolume;
    newBin.Weight = this.currentWeight;

    this.afd.list("Audit").push(newBin);
    this.currentVolume = 0;
    this.currentWeight = 0;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AuditDetailPage');
  }
  loadData(){
    this.afd.list('Audit')
      //this.afd.list('Audit', ref => ref.equalTo('Starbucks cup'))
        .valueChanges().subscribe
        (
          data =>
          {
            console.log(data)
            this.items=data
          }

        );

  }
}
