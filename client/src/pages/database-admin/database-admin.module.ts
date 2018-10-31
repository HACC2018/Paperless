import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatabaseAdminPage } from './database-admin';

@NgModule({
  declarations: [
    DatabaseAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(DatabaseAdminPage),
  ],
})
export class DatabaseAdminPageModule {}
