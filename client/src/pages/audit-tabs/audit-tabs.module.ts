import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuditTabsPage } from './audit-tabs';

@NgModule({
  declarations: [
    AuditTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(AuditTabsPage),
  ]
})
export class AuditTabsPageModule {}
