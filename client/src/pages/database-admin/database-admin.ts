import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuditDetailPage } from '../audit-detail/audit-detail';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the DatabaseAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-database-admin',
  templateUrl: 'database-admin.html',
})
export class DatabaseAdminPage {
  items;
  nameToAdd;
  groupToAdd;
  colorToAdd;
  orderToAdd;
  collectionLoaded;

/*  public category: [{Name: string, Group: string
                        , Color: string, Order: string
                        , icon: string
                      }] = [];*/
                      public category:any;

  //Audit Variables
  /*public audit: [{ Date: string, Location: string
    , Category: string, Weight: string
    , Volume: string }] = [];*/
public audit:any;

//bindable items for audit
date;
location;
auditCategory;
volume;
weight;

//bindable items for Location
AuditLocationName;
AuditLocationGPS;
  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private afd : AngularFireDatabase)
  {
    this.category = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatabaseAdminPage');
  }

  loadCollection(){
    this.afd.list(this.collectionLoaded).valueChanges().subscribe(
      data => {
        console.log(data)
        this.items=data
      }
    )
  }
  addData(){
    this.afd.list("Category").push(this.category);

  }
  addAudit(){
    this.audit.Date = this.date;
    this.audit.Location = this.location;
    this.audit.Category = this.auditCategory;
    this.audit.Volume = this.volume;
    this.audit.Weight = this.weight;

    this.afd.list("Audit").push(this.audit);

    this.date="";
    this.location="";
    this.auditCategory="";
    this.volume="";
    this.weight="";

  }
  addLocation(){
    var location = { "AuditLocationGPS": this.AuditLocationGPS,
                    "AuditLocationName": this.AuditLocationName};
    this.afd.list("Location").push(location);
  }
}
