import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastController, LoadingController, NavController, ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  arquivo: any;
  dados: any = {};
  local: any = [];
  display_end: boolean = true;
  constructor(
    private routeactive: ActivatedRoute,
    private auth: AuthService,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private actionCtrl: ActionSheetController,
    private camera: Camera,
  ) {
    this.auth.listar_dados('tipos-estabelecimentos', 'nome').subscribe(data => {
      this.local = data;
    })
  }

  ngOnInit() {
    this.auth.listar_dados_id(this.routeactive.snapshot.paramMap.get('key'), 'estabelecimentos', 'key')
      .subscribe(data => {
        data.map(teste => {
          this.dados = teste;
        })
      })
  }
  mostrar_end() {
    this.display_end = true;
  }
  esconder_end() {
    this.display_end = false;
  }

  atualizar(dados) {
    dados.nome = dados.nome.toLowerCase().toUpperCase();
    this.loadCtrl.create({
      message: 'Atualizando, aguarde...'
    }).then((l) => {
      l.present();
      this.auth.atualizar('estabelecimentos', dados.key, dados).then(() => {
        l.dismiss();
        this.toastCtrl.create({
          message: 'Estabelecimento atualizado!',
          buttons: [
            {
              text: 'Fechar'
            }
          ],
          duration: 3000
        }).then((t) => {
          t.present();
          this.navCtrl.navigateBack('admin/estabelecimentos');
        })
      }).catch((err) => {
        l.dismiss();
        this.toastCtrl.create({
          message: 'Erro durante a atualização!',
          color: 'danger',
          duration: 3000
        }).then((t) => {
          t.present();
          this.navCtrl.navigateBack('admin/estabelecimentos');
        })
      })
    })
  }

  logo(): void {
    this.actionCtrl.create({
      header: 'Adicionar imagem',
      buttons: [
        {
          text: 'Tirar Foto',
          icon: 'camera',
          handler: () => {
            this.upload('tirar_foto');
          }
        },

        {
          text: 'Escolher foto',
          icon: 'image',
          handler: () => {
            this.upload('escolher_foto');
          }
        }
      ]
    }).then((action) => {
      action.present();
    })
  }

  upload(action: string) {
    if (action === 'tirar_foto') {
      var options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
    } else {
      var options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loadCtrl.create({
        message: 'Carregando imagem...'
      }).then((load) => {
        load.present();
        this.arquivo = 'data:image/jpeg;base64,' + imageData;

        let upload = this.auth.upload_arquivo('imagens', 'estabelecimentos', `${this.routeactive.snapshot.paramMap.get('key')}.jpg`, this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.dados.imagem = img_path;

            this.auth.atualizar('estabelecimentos', this.routeactive.snapshot.paramMap.get('key'), this.dados)
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
}
