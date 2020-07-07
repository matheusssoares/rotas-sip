import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { LoadingController, ToastController, NavController, AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {
  arquivo: any;
  logomarca: any = '';
  dados: any = {
    tipo: 'produtos',
    categoria: 'Roupas e Acessórios',
    data_cadastro: moment().format('LLLL'),
  }
  key_temporario: string;
  constructor(
    private alertCtrl: AlertController,
    public auth: AuthService,
    private camera: Camera,
    private loadCtrl: LoadingController,
    private toast: ToastController,
    public nav: NavController
  ) {
    this.key_temporario = this.auth.db.createId();
  }

  ngOnInit() {
    this.auth.listar_dados_id(this.auth.auth.auth.currentUser.uid, 'usuarios', 'key').subscribe(data => {
      data.map((ret: any) => {
        console.log(ret);
        this.dados.autor = ret.firstName;

      })
    })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
  }

  logo() {
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 300,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loadCtrl.create({
        message: 'Carregando imagem...'
      }).then((load) => {
        load.present();
        this.arquivo = 'data:image/jpeg;base64,' + imageData;

        let upload = this.auth.upload_arquivo('imagens', 'anuncios', `${this.key_temporario}.jpg`, this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.logomarca = img_path;
            load.dismiss();
            this.toast.create({
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
      this.toast.create({
        message: 'Função não suportada neste dispositivo.',
        duration: 3000,
        color: 'danger'
      }).then((toast) => {
        toast.present();
      })

    })
  }

  cadastrar(dados) {
    if (this.logomarca == '') {
      this.alertCtrl.create({
        header: 'Aviso!',
        message: 'Você precisa adicionar uma imagem!',
        buttons: [{
          text: 'Ok'
        }]
      }).then((a) => {
        a.present();
      })
    } else {
      this.loadCtrl.create({
        message: 'Cadastrando, aguarde...'
      }).then((l) => {
        l.present();

        dados.image = this.logomarca;
        dados.key = this.key_temporario;
        dados.key_user = this.auth.auth.auth.currentUser.uid;
        dados.ativo = false;

        this.auth.cadastrar('anuncios', dados).then(() => {
          l.dismiss();
          this.toast.create({
            message: 'Anúncio cadastrado com sucesso e passará por uma análise para ser aprovado!',
            duration: 3500
          }).then((t) => {
            t.present();
            this.nav.back();
          }
          )
        }).catch((err) => {
          l.dismiss();
          this.toast.create({
            message: 'Anúncio não cadastrado!',
            duration: 2500,
            color: 'danger'
          }).then((t) => { t.present() })
        })
      })
    }

  }

}
