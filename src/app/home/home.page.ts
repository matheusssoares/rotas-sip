import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, NavController, AlertController, MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  signupForm: FormGroup;
  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private loadCtrl: LoadingController,
    private auth: AngularFireAuth,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private serviceAuth: AuthService
  ) {
    //this.autenticar();
  }

  ngOnInit(){
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });


    this.autenticar();
    
  }


  autenticar() {
    this.auth.authState.subscribe(data => {
      if (data) {
        this.loadCtrl.create({
          message: 'Aguarde...'
        }).then((l) => {
          l.present();
          //verificando perfil
          this.serviceAuth.listar_dados_id(data.uid, 'usuarios', 'key').subscribe((date) => {
            date.map((ret: any) => {
              if (ret.perfil == 'administrador') {
                /* this.menuCtrl.enable(true, 'main-menu'); */
                this.route.navigateByUrl('perfil');
              } else {
                this.navCtrl.navigateRoot('cliente/dashboard');
              }
            })
          })

          l.dismiss();
        })
      }
    })

  }

  onSubmit() {
    let form = this.signupForm.value;

    //console.log(form);
    
    this.loadCtrl.create({
      message: 'Autenticando, aguarde...'
    }).then((load) => {
      load.present();
      this.auth.auth.signInWithEmailAndPassword(form.email, form.senha).then((ok) => {
        console.log('ok', ok);
                        
        this.serviceAuth.listar_dados_id(ok.user.uid, 'usuarios', 'key').subscribe(data => {
          console.log('wrrr=>', data);
          
          data.map((ret: any) => {
            if(ret.perfil == 'administrador'){
              this.navCtrl.navigateRoot('admin/dashboard');
            } else {
              this.navCtrl.navigateRoot('cliente/dashboard');
            }
          })
        })
        load.dismiss();

      }).catch((error) => {
        console.log(' matheus =>', error);        
        load.dismiss();
        switch (error.code) {
          case 'auth/invalid-email':
            this.alertCtrl.create({
              header: 'Aviso!',
              message: 'E-mail inválido, tente outro.',
              buttons: [
                {
                  text: 'Entendi'
                }
              ]
            }).then((alert) => alert.present())
            break;
          case 'auth/user-disabled':
            this.alertCtrl.create({
              header: 'Aviso!',
              message: 'Usuário bloqueado.',
              buttons: [
                {
                  text: 'Entendi'
                }
              ]
            }).then((alert) => alert.present())
            break;
          case 'auth/user-not-found':
            this.alertCtrl.create({
              header: 'Aviso!',
              message: 'Usuário não encontrado.',
              buttons: [
                {
                  text: 'Entendi'
                }
              ]
            }).then((alert) => alert.present())
            break;
          case 'auth/wrong-password':
            this.alertCtrl.create({
              header: 'Aviso!',
              message: 'Senha não corresponde ao e-mail informado.',
              buttons: [
                {
                  text: 'Entendi'
                }
              ]
            }).then((alert) => alert.present())
            break;
        }
      })
    })
  }

  criar_conta() {
    this.route.navigateByUrl('cadastre-se');
  }
}
