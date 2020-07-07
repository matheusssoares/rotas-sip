import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController, ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
})
export class AdicionarPage implements OnInit {
  local: any = [];
  dados: any = {};
  display_end: boolean = true;
  public logomarca: string;
  key_temporario: string;
  estabelecimento: any = {
    pais: 'Brasil',
    cidade: 'Santa Izabel',
    estado: 'PA',
    cep: '68790-000',
    ativo: true
  }
  public arquivo: any = '';
  constructor(
    public auth: AuthService,
    public actionCtrl: ActionSheetController,
    private camera: Camera,
    private toast: ToastController,
    private loadCtrl: LoadingController,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    public nav: NavController
  ) {
    this.key_temporario = this.auth.db.createId();

  }

  ngOnInit() {
    this.auth.listar_dados('tipos-estabelecimentos', 'nome').subscribe(data => {
      this.local = data;
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

        let upload = this.auth.upload_arquivo('imagens', 'estabelecimentos', `${this.key_temporario}.jpg`, this.arquivo);

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


  mostrar_end() {
    this.display_end = true;
  }
  esconder_end() {
    this.display_end = false;
  }

  cadastrar(estabelecimento) {
    this.dados = estabelecimento;
    this.dados.nome = estabelecimento.nome.toLowerCase().toUpperCase();
    this.dados.imagem = this.logomarca;
    this.dados.key = this.key_temporario;

    this.loadCtrl.create({
      message: 'Cadastrando, aguarde...'
    }).then((l) => {
      l.present();

      this.auth.validar_dados(this.dados.nome, 'estabelecimentos', 'nome').then((data) => {
        if (data) {
          l.dismiss();
          this.alertController.create({
            header: 'Aviso!',
            message: 'Estabelecimento já cadastrado, tente outro nome.',
            buttons: [{
              text: 'Ok'
            }]
          }).then((a) => {
            a.present();
          })
        } else {
          l.dismiss();

          this.auth.cadastrar('estabelecimentos', this.dados).then(() => {
            this.toastCtrl.create({
              message: 'Estabelecimento cadastrado com sucesso!',
              duration: 3000
            }).then((t) => {
              t.present();
              this.nav.navigateBack('admin/estabelecimentos'); 
            })
          }).catch((err) => {
            console.log(err);
          })
        }
      })
    })
  }
}
