import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LoadingController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
})

export class DetalhesPage implements OnInit {
  dados: any = [];
  latitude: number;
  longitude: number;
  constructor(
    private routeactive: ActivatedRoute,
    private loadCtrl: LoadingController,
    private auth: AuthService,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing,
    private geolocation: Geolocation,
    private launchNavigator: LaunchNavigator,
    private locationAccuracy: LocationAccuracy,
    private diagnostic: Diagnostic,
  ) { }

  ngOnInit() {
    this.auth.listar_dados_id(this.routeactive.snapshot.paramMap.get('key'), 'estabelecimentos', 'key')
      .subscribe(data => {
        data.map(teste => {
          this.dados = teste;
        })
      })
  }

  ligar(numero) {
    this.callNumber.callNumber(`55${numero}`, true).then(() => {
      console.log('tudo certo');
    }).catch((err) => {
      alert(err);

    })

  }
  msg(numero) {
    this.socialSharing.shareViaWhatsAppToReceiver(`55${numero}`, 'Olá, entrei em contato via aplicativo Rota SIP!', null, null).then(() => {

    }).catch((e) => {
      console.log(e);

    })
  }

  /* navegar(dados) {
    this.geolocation.getCurrentPosition().then(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    }, error => {
      console.log('error', error);
    });

    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      start: [this.latitude, this.longitude],

    }

    this.launchNavigator.navigate(`${dados.rua},${dados.num}, ${dados.cidade}`, options)
      .then(success => {
        console.log(success);
      }, error => {
        console.log(error);
      })
  } */

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