import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the AuditTabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-audit-tabs',
  templateUrl: 'audit-tabs.html'
})
export class AuditTabsPage {

  auditRoot = 'AuditPage'
  pictureRoot = 'PicturePage'
  homeRoot = 'HomePage'


  constructor(public navCtrl: NavController) {}

}
