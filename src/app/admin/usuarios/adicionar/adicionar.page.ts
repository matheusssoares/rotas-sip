import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../_helper/must-match.validator';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ToastController, NavController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
})
export class AdicionarPage implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  arquivo: any;
  logomarca: any;
  key_temporario: string;
  constructor(
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private _auth: AngularFireAuth,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _db: AngularFirestore,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private camera: Camera,
    private route: Router
  ) {
    this.key_temporario = this.auth.db.createId();
   }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      perfil: ['administrador', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.registerForm.controls; }

  

  logo() {
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loadCtrl.create({
        message: 'Carregando imagem...'
      }).then((load) => {
        load.present();
        this.arquivo = 'data:image/jpeg;base64,' + imageData;

        let upload = this.auth.upload_arquivo('imagens', 'usuarios', `${this.key_temporario}.jpg`, this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.logomarca = img_path;
            load.dismiss();
            this.toastCtrl.create({
              message: 'Imagem adicionada',
              duration: 2000,
              color: 'dark'
            }).then((toast) => {
              toast.present();
            })
          })

        }).catch((err) => {
          console.log(err);
          load.dismiss();

        })


      })
    }).catch((err) => {
      console.log(err);
      this.toastCtrl.create({
        message: 'Função não suportada neste dispositivo.',
        duration: 3000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      })

    })
  }

  onSubmit() {
    this.submitted = true;
 
     if (this.registerForm.invalid) {
       return;
     }
 
     this.loadCtrl.create({
       message: 'Cadastrando, aguarde...'
     }).then((l) => {
       l.present();
 
       this._auth.auth.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password)
         .then((user) => {
           this.registerForm.value.key = user.user.uid;
           this.registerForm.value.imagem = this.logomarca;
           this._db.collection('usuarios').doc(user.user.uid).set(this.registerForm.value)
             .then(() => {
               l.dismiss();
               this.toastCtrl.create({
                 message: 'Conta criada com sucesso!',
                 duration: 2500
               }).then((t) => {
                 t.present();
                 this.navCtrl.navigateBack('admin/usuarios');
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
