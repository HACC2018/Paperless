import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WasteAuditPage } from './waste-audit';

@NgModule({
  declarations: [
    WasteAuditPage,
  ],
  imports: [
    IonicPageModule.forChild(WasteAuditPage),
  ],
})
export class WasteAuditPageModule {}
