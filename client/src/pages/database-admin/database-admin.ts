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

  private category: Array<{Name: string, Group: string
                        , Color: string, Order: string
                        , icon: string
                      }> = [];
  //Audit Variables
  public audit: Array<{ Date: string, Location: string
    , Category: string, Weight: string
    , Volume: string }> = [];


  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private afd : AngularFireDatabase)
  {
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
    //this.afd.list(this.keyToAdd).push(this.valueToAdd);
    this.category.Name="";
    this.category.Group="";
    this.category.Color="";
    this.category.Order="";
    this.category.icon="";
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
