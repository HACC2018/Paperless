import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuditDetailPage } from './audit-detail';

@NgModule({
  declarations: [
    AuditDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AuditDetailPage),
  ],
})
export class AuditDetailPageModule {}
