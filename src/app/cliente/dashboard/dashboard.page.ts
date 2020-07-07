import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { NoticiasService } from 'src/app/services/noticias.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dados_cat: any;
  usuario: any;
  evento_segmento: any;
  hoje = moment().format('L');
  eventos: any = [];
  public alleventos: any;
  news: any = [];
  segmento: any;
  itens: any = [];
  tipos: any = [];
  empresas: any = [];
  slideOpts: any;
  constructor(
    private auth: AuthService,
    private menuCtrl: MenuController,
    private route: Router,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    public noticias: NoticiasService,
    private socialSharing: SocialSharing,
    private transfer: FileTransfer,
    private file: File,
    private toastCtrl: ToastController
  ) {
    this.slideOpts = {
      initialSlide: 0,
      autoplay: true,
      speed: 1000
    };

    this.usuario = this.auth.auth.auth.currentUser.uid;

  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.loadCtrl.create({
      message: 'Aguarde...',
      cssClass: 'ion-color-principal'
    }).then((l) => {
      l.present();
      this.auth.db.collection('anuncios', ref => ref.where('ativo', '==', true)
      .orderBy('data_cadastro', 'desc').limit(10)).valueChanges().subscribe((anuncio: any) => {
        this.itens = anuncio;
      })

      
      this.auth.db.collection('tipos-estabelecimentos', ref => ref.where('ativo', '==', true)
      .orderBy('nome', 'asc')).valueChanges().subscribe((tipo: any) => {
        this.tipos = tipo;
      })

      this.auth.db.collection('estabelecimentos', ref => ref.where('ativo', '==', true)
      .orderBy('nome', 'asc')).valueChanges().subscribe((empresa: any) => {
        this.empresas = empresa;
        this.segmento = 'home';
        l.dismiss();
      })
    })

  }

  historia() {
    this.route.navigateByUrl('cliente/historia');
  }

  sair() {
    this.auth.auth.auth.signOut();
  }

  segmentChanged(ev: any) {
    if (ev.detail.value === 'newspaper') {
      this.loadCtrl.create({
        message: 'Listando notícias',
      }).then((l) => {
        l.present();

        this.noticias.getNews().subscribe((data) => {
          this.news = data;

          console.log(this.news);
          

          l.dismiss();
        })
      })
    }

    if (ev.detail.value === 'calendar') {
      this.listar_todos_eventos();
    }
  }

  compartilhar_news(item) {
    let option = {
      message: 'Veja esta notícia compartilhada pelo app Rota SIP:',
      subject: null,
      files: null,
      url: item.url
    };
    this.socialSharing.shareWithOptions(option).then(() => {
      console.log('processou mensagem');

    })
  }

  pesquisar_eventos(item: any) {
    let val = item.target.value;

    if (val && val.trim() != '') {
      this.eventos = this.alleventos;
      this.eventos = this.eventos.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.eventos = this.alleventos;
    }
  }

  add_evento() {
    this.route.navigateByUrl('cliente/eventos/adicionar');
  }

  eventos_change(ev: any) {
    if (ev.detail.value === 'meus_eventos') {
      this.loadCtrl.create({
        message: 'Listando seus eventos...'
      }).then((l) => {
        l.present();

        this.auth.db.collection('eventos', ref => ref.where('key_user', '==', this.auth.auth.auth.currentUser.uid))
          .valueChanges().subscribe((data: any) => {
            this.eventos = data;
            this.alleventos = this.eventos;
            l.dismiss();
          })
      })
    } else {
      this.listar_todos_eventos();
    }
  }
  listar_todos_eventos() {
    this.loadCtrl.create({
      message: 'Listando eventos',
    }).then((l) => {
      l.present();
      this.auth.db.collection('eventos', ref => ref.where('data_evento', '>=', moment().format()).where('ativo', '==', true))
        .valueChanges().subscribe((data: any) => {
          this.eventos = data;
          this.alleventos = this.eventos;
          this.evento_segmento = 'todos_eventos';


          l.dismiss();
        })
    })
  }

  visualizar_evento(item) {
    this.route.navigateByUrl(`cliente/eventos/visualizar/${item.key}`);
  }

  editar_evento(dados) {
    this.route.navigateByUrl(`cliente/eventos/editar/${dados.key}`);
  }

  compartilhar_evento(dados) {
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

  anuncios(){
    this.route.navigateByUrl('cliente/anuncios');
  }

  ver_todos_locais() {
    this.route.navigateByUrl('cliente/locais');
  }

  ver_anuncios_link(story){
    this.route.navigateByUrl(`cliente/anuncios/visualizar/${story.key}`);
  }

  ver_detalhes_categorias(i){
    this.route.navigateByUrl(`cliente/locais/categorias/${i.key}`);
    
  }

  detalhar_local(item) {
    this.route.navigateByUrl(`cliente/locais/detalhes/${item.key}`);
  }

  add_local(){
    this.route.navigateByUrl('cliente/locais/adicionar');
  }

  desconectar() {
    this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Você deseja se desconectar?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.loadCtrl.create({
              message: 'Desconectando...'
            }).then((l) => {
              l.present();
              this.auth.auth.auth.signOut().then(() => {
                this.toastCtrl.create({
                  message: 'Logout efetuado...',
                  duration: 3000
                }).then((t) => {
                  l.dismiss();
                  t.present();
                  this.menuCtrl.enable(false);
                })
              })
            })
          }
        },
        {
          text: 'Não',
        }
      ]
    }).then((a) => {
      a.present();
    })
  }
}