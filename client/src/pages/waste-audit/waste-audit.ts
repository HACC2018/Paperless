import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { AuditDetailPage } from '../audit-detail/audit-detail';
import { AngularFireDatabase } from 'angularfire2/database';

import { ChangeDetectorRef } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Geolocation } from '@ionic-native/geolocation';
import moment from 'moment';

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
  //This is the variable used to find the the correct place
  GPSTestdifference = 10;
  items; //This holds our data
  isRecording = false;
  categoryList = [];
  isApp = false;
  currentLocation = "";

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private afd : AngularFireDatabase
              , private plt: Platform
              , private speechRecognition : SpeechRecognition
              , private geoLoc : Geolocation
              , public alertCtrl: AlertController
            )
  {
    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WasteAuditPage');
    this.checkPlatform();
    this.getLocation();
  }

  itemTapped(event, item) {
    this.navCtrl.push(AuditDetailPage, {
      item: item
    });
  }
  getData(){
    this.afd.list('Category', ref => ref.orderByChild('Group'))
      .valueChanges().subscribe
      (
        data =>
        {
          this.items=data;
          this.getCategories();
        }
      );
  }
  getCategories(){
    for (let trans of this.items) {
      if(!this.categoryList.includes(trans.Name.toLowerCase()))
        this.categoryList.push(trans.Name.toLowerCase());
    }
  }

  checkPlatform(){
    if(this.plt.is('core') || this.plt.is('mobileweb')) {
      this.isApp = false;
    } else {
      this.isApp = true;
    }
  }
  getPermisions(){
    if(this.isApp)
    {
    this.isRecording = this.isRecording ? false : true;
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) =>
        {
          if(!hasPermission)
            {this.speechRecognition.requestPermission();}
        }
      );
    }
  }
  startListening(){
    //Check permission
    this.getPermisions();
    var userMessage;
    //If this is mobile run this
    console.log("This is andoird?:" + this.isApp)
    if(this.isApp)
    {
      let options = {
        language: 'en-US'
      }
      this.speechRecognition.startListening().subscribe((matches: Array<string>) =>
        {
          this.parseMessage(matches);
        }
      );
    }
    else //Not mobile so run a test
    {
       userMessage = ["1 pound of plastic cups", "one pound of plastic cup"];
       this.parseMessage(userMessage);
    }

  }

  parseMessage(userMessage){
    let type = '';
    let category = '';
    let value = '0';
    let actualMessage= '';

    for(let element of userMessage){
      element = element.toLowerCase();

      //Used to find numbers
      let regex = /[+-]?\d+(?:\.\d+)?/g;

      //get the type
      if(element.indexOf("pound") > 0 || element.indexOf(" lbs ")  > 0){
        type = 'Weight';
      }
      else if(element.indexOf("%") > 0||
              element.indexOf("%") > 0||
              element.indexOf("bag") > 0){
        type = 'Volume';
      }
      //Doesnt get to here
      this.currentLocation = value + element;

      //Find the value to use
      value = regex.exec(element)[0];


      //Find the categoryList
      for(let catName of this.categoryList){
        if(element.indexOf(catName)>0){
          category = catName;
          break;
        }
      }

      if(type !== '' && value !== '' && category !== '' ){
        //Found the values we need
        actualMessage = element;
        console.log("Found the item to add");
        break;
      }
    }
    this.currentLocation = "WE get to here";
    this.showConfirm(actualMessage, category, type, value);
  }
  showConfirm(usedMessage, name, type, value) {
  let confirmed;
  let message;
  message = '<p> Original message -(' + usedMessage + ')</p> ' + 'Adding Name: (' + name + ') ' + type + ': (' + value + ')';

  const confirm = this.alertCtrl.create({
    title: 'Add this bin?',
    message: (message),
    buttons: [
      {
        text: 'Disagree',
        handler: () => {
          confirmed='false';
        }
      },
      {
        text: 'Agree',
        handler: data => {
          this.saveVoiceBin(name, type=='Weight'?value:0, type=='Volume'?value:0);
        }
      }
    ]
  });

  confirm.present();
  console.log('clicked 1:' + confirm);
  }

  saveVoiceBin(categoryName, volumnToAdd, WeightToAdd){
    console.log("saving data")
    var newBin = {
      Category: categoryName,
      Date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
      Location: '',
      Lat: '',
      Long: '',
      Volume: volumnToAdd,
      Weight: WeightToAdd
    };

    //Getting location can take some time so we need to wait
    this.geoLoc.getCurrentPosition().then((position) => {
        newBin.Location = position.coords.latitude + ':' + position.coords.longitude;
        newBin.Lat = "" + position.coords.latitude;
        newBin.Long = "" + position.coords.longitude;
        console.log('My location: ', newBin.Location);
        this.afd.list("Audit").push(newBin);
      });
}

  getLocation(){
    //Getting location can take some time so we need to wait
    this.geoLoc.getCurrentPosition().then((position) => {
      this.loadLocationData(position.coords.latitude, position.coords.longitude);
    });
  }
  loadLocationData(lat1, long1){
    this.currentLocation = "Loading location";
    this.afd.list('Location').valueChanges().subscribe(
      data=>
      {
        for(let currentRow of data){

          var lat2, long2, dist;
          var x: any = currentRow;
          dist = this.GPSTestdifference+1;

          lat2 = x.AuditLocationLat;
          long2 = x.AuditLocationLong;

          //// TODO: Make this calculation a little more better
          dist = Math.abs(parseFloat(lat1)-parseFloat(lat2))
                  + Math.abs(parseFloat(long1)-parseFloat(long2));
                  console.log("Here is the distance: " + dist);

          if(dist < this.GPSTestdifference){
            this.currentLocation = x.AuditLocationName;
            break;
          }
        }
        if(this.currentLocation == "Loading location"){
          this.currentLocation="Error Loading location";
        }
      }
    );
  }


}
