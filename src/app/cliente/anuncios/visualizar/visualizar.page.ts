import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, AlertController, ToastController, NavController } from '@ionic/angular';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {
  dados: any;
  mostrar: boolean = false;
  constructor(
    private routeactive: ActivatedRoute,
    private auth: AuthService,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private transfer: FileTransfer,
    private file: File,
    private socialSharing: SocialSharing,
    private route: Router,
    private navCtrl: NavController
  ) {

  }

  ngOnInit() {
    this.auth.listar_dados_id(this.routeactive.snapshot.paramMap.get('key'), 'anuncios', 'key')
      .subscribe(data => {
        data.forEach(ret => {
          this.dados = ret;
          var key_user = this.dados.key_user;
          var id = this.auth.auth.auth.currentUser.uid;
          if (key_user === id) {
            this.mostrar = true;
          }

        })
      })
  }

  compartilhar(dados) {
    this.loadCtrl.create({
      message: 'Buscando dados, aguarde...'
    }).then((l) => {
      l.present();

      var fileTransfer = new FileTransfer();
      var uri = dados.image;

      fileTransfer.create().download(uri, this.file.dataDirectory + 'file.png').then((data) => {
        let option = {
          message: `*${dados.nome.toUpperCase()}* - ${dados.descricao}. Anúncio feito por ${dados.autor}. Divulgado pelo app *Rotas SIP*.`,
          subject: null,
          files: [data.nativeURL],
          url: null
        };

        this.socialSharing.shareWithOptions(option).then((e) => {
          l.dismiss()
          console.log(e);
        }).catch((err) => {
          console.log(err);
          l.dismiss()
        })
      }).catch((err) => {
        console.log(err);

      })
    })

  }

  msg(dados) {
    this.socialSharing.shareViaWhatsAppToReceiver(`55${dados.whatsapp}`, `Olá, entrei em contato via aplicativo Rota SIP! Em relação ao anúncio: ${dados.nome}`, null, null).then(() => {

    }).catch((e) => {
      console.log(e);

    })

  }

  editar(dados) {
    this.route.navigateByUrl(`cliente/anuncios/editar/${dados.key}`);
  }

  excluir(dados) {
    this.alertCtrl.create({
      header: 'Aviso!',
      message: 'Você deseja excluir este anúncio?',
      buttons: [{
        text: 'Sim',
        handler: () => {
          this.auth.excluir('anuncios', dados.key).then(() => {
            this.toastCtrl.create({
              message: 'Registro excluído com sucesso!',
              duration: 2500
            }).then(t => {
              t.present();
              this.navCtrl.back();
            })
          })
        }
      },
      {
        text: 'Não',
      }]
    }).then((a) => a.present())
  }

}
