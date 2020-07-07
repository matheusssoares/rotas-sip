import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {
  dados: any = {};
  latitude: number;
  longitude: number;
  constructor(
    private routeactive: ActivatedRoute,
    private auth: AuthService,
    private socialSharing: SocialSharing,
    private loadCtrl: LoadingController,
    private transfer: FileTransfer,
    private file: File,
    private geolocation: Geolocation,
    private launchNavigator: LaunchNavigator,
    private diagnostic: Diagnostic,
    private locationAccuracy: LocationAccuracy
  ) { }

  ngOnInit() {
    this.auth.listar_dados_id(this.routeactive.snapshot.paramMap.get('key'), 'eventos', 'key')
      .subscribe(data => {
        this.dados = data[0];
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
          message: `Venha participar do evento *${dados.nome.toUpperCase()}* - ${dados.data_consulta} - ${dados.local}. Evento organizado por ${dados.organizador}. Divulgado pelo app *Rotas SIP*.`,
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
    this.socialSharing.shareViaWhatsAppToReceiver(`55${dados.whatsapp}`, 'Olá, entrei em contato via aplicativo Rota SIP!', null, null).then(() => {

    }).catch((e) => {
      console.log(e);

    })

  }

  navegar(dados) {
    this.loadCtrl.create({
      message: 'Aguarde...'
    }).then((l) => {
      l.present();

      this.diagnostic.isGpsLocationEnabled().then((enable) => {
        if (enable) {
          l.dismiss();
          this.geolocation.getCurrentPosition().then((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;

            let options: LaunchNavigatorOptions = {
              app: this.launchNavigator.APP.GOOGLE_MAPS,
              start: [this.latitude, this.longitude],

            }

            this.launchNavigator.navigate(`${dados.rua},${dados.num}, ${dados.cidade}`, options)
              .then(success => {
                console.log(success);
                l.dismiss();
              }, error => {
                console.log(error);
                l.dismiss();
              })

          }).catch((err) => {
            console.log(err);
          })
        } else {
          l.dismiss();
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                this.geolocation.getCurrentPosition().then((position) => {
                  this.latitude = position.coords.latitude;
                  this.longitude = position.coords.longitude;
      
                  let options: LaunchNavigatorOptions = {
                    app: this.launchNavigator.APP.GOOGLE_MAPS,
                    start: [this.latitude, this.longitude],
      
                  }
      
                  this.launchNavigator.navigate(`${dados.rua},${dados.num}, ${dados.cidade}`, options)
                    .then(success => {
                      console.log(success);
                      l.dismiss();
                    }, error => {
                      console.log(error);
                      l.dismiss();
                    })
      
                }).catch((err) => {
                  console.log(err);
                })
              }).catch(err => {
                l.dismiss();
                console.log(err);
              })
            }

          });
        }
      })
    })
  }

}