import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WasteAuditPage } from '../pages/waste-audit/waste-audit';
import { AuditReportPage } from '../pages/audit-report/audit-report';
import { AuditDetailPage } from '../pages/audit-detail/audit-detail';
import { DatabaseAdminPage } from '../pages/database-admin/database-admin';
import { WasteAuditReportsPage } from '../pages/waste-audit-reports/waste-audit-reports';

//Import AF2 Module for firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';

import { SpeechRecognition } from '@ionic-native/speech-recognition';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyDlgWOayZA6-YHrPk6cEVy6t9YQsUrz1V4",
  authDomain: "paperless-e44e7.firebaseapp.com",
  databaseURL: "https://paperless-e44e7.firebaseio.com",
  projectId: "paperless-e44e7",
  storageBucket: "paperless-e44e7.appspot.com",
  messagingSenderId: "398851433700"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WasteAuditPage,
    AuditReportPage,
    AuditDetailPage,
    DatabaseAdminPage,
    WasteAuditReportsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WasteAuditPage,
    AuditReportPage,
    AuditDetailPage,
    DatabaseAdminPage,
    WasteAuditReportsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SpeechRecognition,
    Geolocation,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
