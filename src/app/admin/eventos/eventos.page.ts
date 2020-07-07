import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  seg: string = 'todos';
  itens: any = null;
  public allItens: any;
  constructor(
    private route: Router,
    private loadCtrl: LoadingController,
    public auth: AuthService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
    this.auth.listar_dados('eventos', 'data_evento').subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;
    })
  }

  add() {
    this.route.navigateByUrl('admin/eventos/adicionar');
  }

  editar(item) {
    this.route.navigateByUrl(`admin/eventos/editar/${item.key}`);
  }

  excluir(item) {
    //console.log(item);
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

  pesquisar(item: any) {
    let val = item.target.value;

    if (val && val.trim() != '') {
      this.itens = this.allItens;
      this.itens = this.itens.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.itens = this.allItens;
    }
  }

  compartilhar(item) {
    let options = {
      message: `Venha participar do evento *${item.nome.toUpperCase()}* - ${data} às ${hora} - ${item.local}. Evento organizado por ${item.organizador}. Divulgado pelo app *Rota SIP*.
      `, // not supported on some apps (Facebook, Instagram)
      subject: null, // fi. for email
      files: null, // an array of filenames either locally or remotely
      url: null,
    }
    var data = moment(item.data_evento).format('L');
    var hora = moment(item.hora_evento).format('LT');
    this.socialSharing.shareWithOptions(options).then(() => {
      console.log('processou mensagem');
    })


  }

  change(ev: any){
    if (ev.detail.value === 'pendentes') {
      this.loadCtrl.create({
        message: 'Listando pendentes...'
      }).then((l) => {
        l.present();

        this.auth.db.collection('eventos', ref => ref.where('ativo', '==', false))
          .valueChanges().subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
            l.dismiss();
          })
      })
    } else {
      this.auth.listar_dados('eventos', 'data_evento').subscribe((data: any) => {
        this.itens = data;
        this.allItens = this.itens;
      })
    }

  }

}
