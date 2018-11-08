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
  GPSTestdifference = .05;
  items; //This holds our data
  isRecording = false;
  categoryList = [];
  isApp = false;
  currentLocation = "Loading location";

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
    this.afd.list('Category', ref => ref.orderByChild('Order'))
      .valueChanges().subscribe
      (
        data =>
        {
          data = data.sort(function(a:any, b:any){return a.Order-b.Order});
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
       userMessage = ["starbucks cups 10-lbs 30 %"];
       //userMessage = ["duck duck goose"];
       this.parseMessage(userMessage);
    }

  }

  parseMessage(userMessage){
    var finalVolume, finalWeight, finalCategory,actualMessage;
    let regex = /[-+]?[0-9]*\.?[0-9]+/g;
    console.log("testing audio check");
    console.log(userMessage);

    for(let currentMsg of userMessage){
      var volume, weight, category ;
      var wMarker, vMarker;
      var foundNumbers:any;

      category = '';
      volume = 0;
      weight = 0;

      wMarker = -1;
      vMarker = -1;

      //Easier to handle all lower
      currentMsg = currentMsg.toLowerCase();
      //mostly want to get rid of plural, but i think this should still work
      currentMsg = currentMsg.replace("s", "");

      //Find the category
      for(let catName of this.categoryList){
        var cleanCatName = catName.toLowerCase().replace("s", "");
        if(currentMsg.indexOf(cleanCatName)>=0){
          category = catName;
          break;
        }
      }

      //Find the weight
      var wName="xxx";
      if(currentMsg.indexOf("pound") >= 0) wName = 'pound';
      else if (currentMsg.indexOf("lbs")  >= 0) wName = 'lbs';
      wMarker = currentMsg.indexOf(wName);

      //Find the volume markers
      var vName="xxx";
      var choices
      if(currentMsg.indexOf("%") >= 0) vName = '%';
      else if (currentMsg.indexOf("percent")  >= 0) vName = 'percent';
      else if (currentMsg.indexOf("bag")  >= 0) vName = 'bag';
      vMarker = currentMsg.indexOf(vName);


      //Find the numbers to use
      foundNumbers = currentMsg.match(regex);

      if(foundNumbers != null)
      {
        if(foundNumbers.length > 0)
        {
          if(vMarker>wMarker)
            weight = foundNumbers[0];
          else
            volume = foundNumbers[0];
        }
        if(foundNumbers.length>1)
        {
          if(vMarker>wMarker)
            volume = foundNumbers[1];
          else
            weight = foundNumbers[1];
        }
      }

      if(category != ""){
        //If we foun something set the values
         if(category != "" && (weight != 0 || volume != 0)){
           finalCategory = category;
           finalWeight = weight;
           finalVolume = volume;
           actualMessage = currentMsg;
         }
         //If we found everything we need break;
         if(category != "" && weight != 0 && volume != 0){

          break;

        }
      }
    }


    console.log("f:" + finalCategory);
    console.log("w:" + finalWeight);
    console.log("v:" + finalVolume);

    if(finalCategory && (finalWeight  || finalVolume ))
      this.showConfirm(actualMessage, finalCategory, finalWeight, finalVolume);
    else
      this.showError(actualMessage);
  }

  showConfirm(usedMessage, category, weight, volume) {
  let confirmed;
  let message;
  message = '<p> Original message -(' + usedMessage + ')</p> ' + 'Adding Name: (' + category + ') Weight: [' + weight + '] Volume: [' + volume + '%]';

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
          this.saveVoiceBin(category, volume, weight);
        }
      }
    ]
  });

  confirm.present();
  }
  showError(usedMessage){
    const confirm = this.alertCtrl.create({
      title: 'Could not understand',
      message: "Sorry could not understand the message. Please try again",
      buttons: ['OK']
    });

    confirm.present();
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
    console.log(categoryName);
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
