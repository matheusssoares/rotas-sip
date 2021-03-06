import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private menuCtrl: MenuController) { 
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.menuCtrl.enable(true, 'main-menu');
  }

}
