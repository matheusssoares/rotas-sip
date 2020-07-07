import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
  }
  admin(){
    this.navCtrl.navigateRoot('admin/dashboard');
  }
  comum(){
    this.navCtrl.navigateRoot('cliente/dashboard');
  }

  logout(){
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

}
