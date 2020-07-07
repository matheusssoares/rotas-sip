import { Component } from '@angular/core';
import { Platform, AlertController, ToastController, MenuController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController,
    private loadCtrl: LoadingController,
    private router: Router,
    private lottieSplashScreen: LottieSplashScreen
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();      
    });


  }

  signOut() {
    this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Você deseja se desconectar?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.loadCtrl.create({
              message: 'Desconectando...'
            }).then((l) => {
              l.present();
              this.afAuth.auth.signOut().then(() => {
                this.toastCtrl.create({
                  message: 'Logout efetuado...',
                  duration: 3000
                }).then((t) => {
                  l.dismiss();
                  t.present();
                  this.menuCtrl.enable(false);
                })
              })
            })
          }
        },
        {
          text: 'Não',
        }
      ]
    }).then((a) => {
      a.present();
    })

  }

  dashboard() {
    this.router.navigateByUrl('admin/dashboard')
  }
  tipos() {
    this.router.navigateByUrl('admin/tipos-estabelecimentos');
  }
  estabelecimentos() {
    this.router.navigateByUrl('admin/estabelecimentos');
  }
  noticias() {
    this.router.navigateByUrl('admin/noticias');
  }
  eventos() {
    this.router.navigateByUrl('admin/eventos');
  }
  anuncios() {
    this.router.navigateByUrl('admin/anuncios');
  }
  usuarios() {
    this.router.navigateByUrl('admin/usuarios');
  }
  config() {
    console.log('config');

  }
}
