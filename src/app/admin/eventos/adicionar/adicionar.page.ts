import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ActionSheetController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
moment.locale('pt-BR');
@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
})
export class AdicionarPage implements OnInit {
  public logomarca: string;
  public arquivo: string;
  dados: any = {
    tipo_evento: 'free',
    pais: 'Brasil',
    cidade: 'Santa Izabel',
    estado: 'PA',
    cep: '68790-000',
    ativo: true
  };
  display_end: boolean = true;
  hoje = moment().format('YYYY-MM-DD').toString();
  ctrl_ingresso: boolean = false;
  key_temporario: string;
  constructor(
    public auth: AuthService,
    public actionCtrl: ActionSheetController,
    private camera: Camera,
    private toast: ToastController,
    private loadCtrl: LoadingController,
    public nav: NavController
  ) {
    this.key_temporario = this.auth.db.createId();
  }

  ngOnInit() {
  }
  alterou(event) {
    console.log(event.detail.value);
    if (event.detail.value === 'premium') {
      this.ctrl_ingresso = true;
    } else {
      this.ctrl_ingresso = false;
    }
  }
  mostrar_end() {
    this.display_end = true;
  }
  esconder_end() {
    this.display_end = false;
  }

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

        let upload = this.auth.upload_arquivo('imagens', 'eventos', `${this.key_temporario}.jpg`, this.arquivo);

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
    dados.data_evento = moment(dados.data_evento).format();
    dados.data_consulta = moment(dados.data_evento).format('L');
    this.loadCtrl.create({
      message: 'Cadastrando, aguarde...'
    }).then((l) => {
      l.present();

      dados.image = this.logomarca;
      this.dados.key = this.key_temporario;
      dados.key_user = this.auth.auth.auth.currentUser.uid;
      this.auth.cadastrar('eventos', dados).then(() => {
        l.dismiss();
        this.toast.create({
          message: 'Evento cadastrado com sucesso!',
          duration: 2500
        }).then((t) => {
          t.present();
          this.nav.navigateBack('admin/eventos');
        }
        )
      }).catch((err) => {
        l.dismiss();
        this.toast.create({
          message: 'Evento não cadastrado!',
          duration: 2500,
          color: 'danger'
        }).then((t) => { t.present() })
      })
    })

  }

}
