import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuditReportPage } from './audit-report';

@NgModule({
  declarations: [
    AuditReportPage,
  ],
  imports: [
    IonicPageModule.forChild(AuditReportPage),
  ],
})
export class AuditReportPageModule {}
