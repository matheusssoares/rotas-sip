import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helper/must-match.validator';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ToastController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cadastre-se',
  templateUrl: './cadastre-se.page.html',
  styleUrls: ['./cadastre-se.page.scss'],
})
export class CadastreSePage implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private _auth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _db: AngularFirestore,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loadCtrl.create({
      message: 'Autenticando, aguarde...'
    }).then((l) => {
      l.present();

      this._auth.auth.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password)
        .then((user) => {
          this.registerForm.value.key = user.user.uid;
          this.registerForm.value.perfil = 'comum';
          this._db.collection('usuarios').doc(user.user.uid).set(this.registerForm.value)
            .then(() => {
              l.dismiss();
              this.toastCtrl.create({
                message: 'Conta criada com sucesso!',
                duration: 2500
              }).then((t) => {
                t.present();
                this.navCtrl.navigateRoot('cliente/dashboard');
              })
            }).catch((error) => {
              l.dismiss();

              switch (error.code) {
                case 'auth/email-already-in-use':
                  this.alertCtrl.create({
                    header: 'Atenção!',
                    message: 'Este e-mail já está vinculado em outra conta, tente outro.',
                    buttons: [{
                      text: 'Entendi'
                    }]
                  }).then((alert) => alert.present())
                  break;

                case 'auth/invalid-email':
                  this.alertCtrl.create({
                    header: 'Atenção!',
                    message: 'Este e-mail é inválido, tente outro.',
                    buttons: [{
                      text: 'Entendi'
                    }]
                  }).then((alert) => alert.present())
                  break;

                case 'auth/operation-not-allowed':
                  this.alertCtrl.create({
                    header: 'Atenção!',
                    message: 'Temporariamente bloqueada esta opção.',
                    buttons: [{
                      text: 'Entendi'
                    }]
                  }).then((alert) => alert.present())
                  break;

                case 'auth/weak-password':
                  this.alertCtrl.create({
                    header: 'Atenção!',
                    message: 'Senha muito fraca, tente outra.',
                    buttons: [{
                      text: 'Entendi'
                    }]
                  }).then((alert) => alert.present())
                  break;
              }
            })
        })
    })


  }

}
