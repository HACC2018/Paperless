import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuditDetailPage } from '../audit-detail/audit-detail';
import { AngularFireDatabase } from 'angularfire2/database';

import { ChangeDetectorRef } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

/**
 * Generated class for the WasteAuditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waste-audit',
  templateUrl: 'waste-audit.html',
})
export class WasteAuditPage {
  items;
  matches: string[];
  isRecording = false;

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private afd : AngularFireDatabase
              , private plt: Platform
              , private speechRecognition : SpeechRecognition
              , private cd: ChangeDetectorRef
            )
  {
    this.getData();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad WasteAuditPage');
  }
  getDataOld(){
    var defaultNote = 'W: 0.00' + ' - V: 0.00';

    this.items = [];

    //Item of interest
    this.items.push({
      title: 'Starbucks cups',
      note: defaultNote,
      icon: 'cafe',
      color: 'primary'
    });
    this.items.push({
      title: 'Plastic to-go cups',
      note: defaultNote ,
      icon: 'cafe',
      color: 'primary'
    });
    this.items.push({
      title: 'Wax paper cups',
      note: defaultNote ,
      icon: 'cafe',
      color: 'primary'
    });
    this.items.push({
      title: 'Compostable take-out (cups, utensils and boxes)',
      note: defaultNote ,
      icon: 'restaurant',
      color: 'primary'
    });
    this.items.push({
      title: 'Disposable utensils (chopsticks, plastic utensils)',
      note: defaultNote ,
      icon: 'restaurant',
      color: 'primary'
    });
    this.items.push({
      title: 'Straws',
      note: defaultNote ,
      icon: 'water',
      color: 'primary'
    });

    //Paper
    this.items.push({
      title: 'Recyclable Paper',
      note: defaultNote ,
      icon: 'paper',
      color: 'secondary'
    });
    this.items.push({
      title: 'Shredded Paper',
      note: defaultNote ,
      icon: 'paper',
      color: 'secondary'
    });
    this.items.push({
      title: 'Non-Recyclable Paper',
      note: defaultNote ,
      icon: 'paper',
      color: 'secondary'
    });
    this.items.push({
      title: 'Paper Towel',
      note: defaultNote ,
      icon: 'paper',
      color: 'secondary'
    });
  }
  getData(){
    //this.getDataOld();
      this.afd.list('Category', ref => ref.orderByChild('Group'))
        .valueChanges().subscribe
        (
          data =>
          {
            console.log(data)
            this.items=data
          }

        );

        this.matches = this.items;
      //.valueChanges().subscribe({console.log(ref);})
  }

  itemTapped(event, item) {
    this.navCtrl.push(AuditDetailPage, {
      item: item
    });
  }
  isIos()
  {
    return this.plt.is('ios')
  }
  isAndroid()
  {
    return this.plt.is('android')
  }
  getPermisions(){
  this.isRecording = this.isRecording ? false : true;
  this.speechRecognition.hasPermission()
  .then((hasPermission: boolean) =>
      {
        if(!hasPermission)
          {this.speechRecognition.requestPermission();}
      }
    );
  }
  startListening(){
    //If this is mobile run this
    if(this.isIos() || this.isAndroid())
    {
      let options = {
        language: 'en-US'
      }
      this.speechRecognition.startListening().subscribe(matches =>
      {
        this.matches = matches;
        this.cd.detectChanges();
      });
      this.isRecording = true;
    }
    else //Not mobile so run a test
    {
      this.matches = ["1 pound of cups", "one pound of cups"];
    }
  }
}
