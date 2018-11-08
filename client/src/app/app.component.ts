import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { WasteAuditPage } from '../pages/waste-audit/waste-audit';
import { DatabaseAdminPage } from '../pages/database-admin/database-admin';
import { WasteAuditReportsPage } from '../pages/waste-audit-reports/waste-audit-reports';
import { WasteAuditButtonPage } from '../pages/waste-audit-button/waste-audit-button';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = WasteAuditPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();
    this.pages = [
      { title: 'Waste Audit', component: WasteAuditPage },
      { title: 'Waste Audit Reports', component: WasteAuditReportsPage },
      { title: 'Waste Button Report', component: WasteAuditButtonPage },
      { title: 'Database helper (Use with Caution)', component: DatabaseAdminPage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
