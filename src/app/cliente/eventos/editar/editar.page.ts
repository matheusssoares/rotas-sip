import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');
@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  arquivo: any;
  dados: any = {};
  ctrl_ingresso: boolean = false;
  display_end: boolean = true;
  hoje = moment().format('YYYY-MM-DD').toString();
  constructor(
    private routeactive: ActivatedRoute,
    private alertCtrl: AlertController,
    private auth: AuthService,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private actionCtrl: ActionSheetController,
    private camera: Camera,
    private route: Router
  ) {

   }

  ngOnInit() {
    this.auth.listar_dados_id(this.routeactive.snapshot.paramMap.get('key'), 'eventos', 'key')
      .subscribe(data => {
        console.log(data);
        this.dados = data[0];
        console.log(this.dados);
      })
  }

  alterou(event) {
    console.log(event.detail.value);
    if (event.detail.value === 'premium') {
      this.ctrl_ingresso = true;
    } else {
      this.ctrl_ingresso = false;
    }
  }

  excluir(item) {
    this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Você deseja excluir este registro?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.excluir('eventos', item.key).then(() => {
              this.toastCtrl.create({
                message: 'Registro excluído com sucesso!',
                duration: 3000
              }).then((t) => {
                t.present();
                this.navCtrl.back();
              })
            }).catch((err) => {
              this.toastCtrl.create({
                message: 'Não conseguimos excluir este registro!',
                color: 'danger',
                duration: 3000
              }).then((t) => {
                t.present();
              })
            })
          },
        },
        {
          text: 'Não'
        }
      ]
    }).then((a) => a.present())
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

        let upload = this.auth.upload_arquivo('imagens', 'eventos', `${this.routeactive.snapshot.paramMap.get('key')}.jpg`, this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.dados.image = img_path;

            this.auth.atualizar('eventos', this.routeactive.snapshot.paramMap.get('key'), this.dados)
              .then(() => {
                load.dismiss();
                this.toastCtrl.create({
                  message: 'Imagem adicionada',
                  duration: 2000,
                  color: 'dark'
                }).then((toast) => {
                  toast.present();
                })
              }).catch((err) => {
                this.toastCtrl.create({
                  message: 'Não conseguimos atualizar a foto.',
                  duration: 3000,
                  color: 'danger'
                }).then((toast) => {
                  toast.present();
                })
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

  atualizar(dados) {
    dados.data_evento = moment(dados.data_evento).format();
    dados.data_consulta = moment(dados.data_evento).format('L');
    this.loadCtrl.create({
      message: 'Atualizando, aguarde...'
    }).then((l) => {
      l.present();
      this.auth.atualizar('eventos', dados.key, dados).then(() => {
        l.dismiss();
        this.toastCtrl.create({
          message: 'Evento atualizado!',
          buttons: [
            {
              text: 'Fechar'
            }
          ],
          duration: 3000
        }).then((t) => {
          t.present();
          this.navCtrl.back();
        })
      }).catch((err) => {
        l.dismiss();
        this.toastCtrl.create({
          message: 'Erro durante a atualização!',
          color: 'danger',
          duration: 3000
        }).then((t) => {
          t.present();
          this.navCtrl.navigateBack('admin/eventos');
        })
      })
    })
  }

  mostrar_end() {
    this.display_end = true;
  }

  esconder_end() {
    this.display_end = false;
  }

}
