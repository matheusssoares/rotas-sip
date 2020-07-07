import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  arquivo: any;
  logomarca: any;
  dados: any = {};
  constructor(
    private routeactive: ActivatedRoute,
    private auth: AuthService,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private camera: Camera,
  ) { }

  ngOnInit() {
    this.auth.listar_dados_id(this.routeactive.snapshot.paramMap.get('key'), 'anuncios', 'key')
      .subscribe(data => {
        data.map(teste => {
          this.dados = teste;
        })
      })
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
  }

  logo(){
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit:true,
      targetHeight: 300,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.loadCtrl.create({
        message: 'Carregando imagem...'
      }).then((load) => {
        load.present();
        this.arquivo = 'data:image/jpeg;base64,' + imageData;

        let upload = this.auth.upload_arquivo('imagens', 'anuncios', `${this.routeactive.snapshot.paramMap.get('key')}.jpg`, this.arquivo);

        upload.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((img_path) => {
            this.dados.image = img_path;

            this.auth.atualizar('anuncios', this.routeactive.snapshot.paramMap.get('key'), this.dados)
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
                console.log(err);
                
                load.dismiss();
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
    dados.ativo = false;
    this.loadCtrl.create({
      message: 'Atualizando, aguarde...'
    }).then((l) => {
      l.present();
      this.auth.atualizar('anuncios', dados.key, dados).then(() => {
        l.dismiss();
        this.toastCtrl.create({
          message: 'Anúncio atualizado e passará por uma análise para ser aprovado!',
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
          this.navCtrl.back();
        })
      })
    })
  }

}
