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
    this.afd.list("Audit").push(this.audit);
    this.audit.Date="";
    this.audit.Location="";
    this.audit.Category="";
    this.audit.Volume="";
    this.audit.Weight="";

  }
}
