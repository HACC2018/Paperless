import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WasteAuditReportsPage } from './waste-audit-reports';

@NgModule({
  declarations: [
    WasteAuditReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(WasteAuditReportsPage),
  ],
})
export class WasteAuditReportsPageModule {}
