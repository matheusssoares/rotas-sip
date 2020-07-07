import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController, ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {
  itens: any = [];
  public allItens: any;
  anuncio_segmento: any = 'todos';
  filtro: any;
  constructor(
    private route: Router,
    public auth: AuthService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    public actionCtrl: ActionSheetController
  ) {

  }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Carregando...'
    }).then((l) => {
      l.present();
      this.auth.db.collection('anuncios', ref =>
        ref.where('ativo', '==', true).orderBy('data_cadastro', 'asc')).valueChanges()
        .subscribe((data: any) => {
          this.itens = data;
          this.allItens = this.itens;
          l.dismiss();
        })
    })
  }

  eventos_change(ev: any) {
    if (ev.detail.value === 'meus') {
      this.meus_anuncios();
    } else {
      this.listar_todos_anuncios();
    }
  }

  listar_todos_anuncios() {
    this.loadCtrl.create({
      message: 'Carregando...'
    }).then((l) => {
      l.present();
      this.auth.db.collection('anuncios', ref =>
        ref.where('ativo', '==', true).orderBy('data_cadastro', 'asc')).valueChanges()
        .subscribe((data: any) => {
          this.itens = data;
          this.allItens = this.itens;
          l.dismiss();
        })
    })
  }

  filtrar() {
    this.actionCtrl.create({
      header: 'Filtrar',
      buttons: [
        {
          text: 'Produtos',
          icon: 'basket',
          handler: () => {
            this.filtro_action(this.anuncio_segmento, 'produtos');
          }
        },
        {
          text: 'Serviços',
          icon: 'hammer',
          handler: () => {
            this.filtro_action(this.anuncio_segmento, 'servicos');

          }
        },
        {
          text: 'Empregos',
          icon: 'briefcase',
          handler: () => {
            this.filtro_action(this.anuncio_segmento, 'empregos');

          }
        },
        {
          text: 'Limpar Filtros',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.filtro_action(this.anuncio_segmento, 'limpar');
          }
        }
      ]
    }).then((action) => {
      action.present();
    })
  }

  filtro_action(segmento, acao) {
    if (acao == 'limpar') {
      if (segmento == 'meus') {
        this.meus_anuncios();
      } else {
        this.listar_todos_anuncios();
      }
    } else if (acao == 'produtos') {
      if (segmento == 'meus') {
        this.auth.db.collection('anuncios', ref =>
          ref.where('key_user', '==', this.auth.auth.auth.currentUser.uid)
            .where('tipo', '==', acao).orderBy('data_cadastro', 'asc')).valueChanges()
          .subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
          })
      } else {
        this.auth.db.collection('anuncios', ref =>
          ref.where('ativo', '==', true)
            .where('tipo', '==', acao).orderBy('data_cadastro', 'asc')).valueChanges()
          .subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
          })
      }
    } else if (acao == 'servicos') {
      if (segmento == 'meus') {
        this.auth.db.collection('anuncios', ref =>
          ref.where('key_user', '==', this.auth.auth.auth.currentUser.uid)
            .where('tipo', '==', acao).orderBy('data_cadastro', 'asc')).valueChanges()
          .subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
          })
      } else {
        this.auth.db.collection('anuncios', ref =>
          ref.where('ativo', '==', true)
            .where('tipo', '==', acao).orderBy('data_cadastro', 'asc')).valueChanges()
          .subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
          })
      }
    } else {
      if (segmento == 'meus') {
        this.auth.db.collection('anuncios', ref =>
          ref.where('key_user', '==', this.auth.auth.auth.currentUser.uid)
            .where('tipo', '==', acao).orderBy('data_cadastro', 'asc')).valueChanges()
          .subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
          })
      } else {
        this.auth.db.collection('anuncios', ref =>
          ref.where('ativo', '==', true)
            .where('tipo', '==', acao).orderBy('data_cadastro', 'asc')).valueChanges()
          .subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
          })
      }
    }

  }

  meus_anuncios() {
    this.loadCtrl.create({
      message: 'Listando seus anúncios...'
    }).then((l) => {
      l.present();

      this.auth.db.collection('anuncios', ref =>
        ref.where('key_user', '==', this.auth.auth.auth.currentUser.uid)
          .orderBy('data_cadastro', 'asc'))
        .valueChanges().subscribe((data: any) => {
          this.itens = data;
          this.allItens = this.itens;
          l.dismiss();
        })
    })
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

  visualizar(item){
    this.route.navigateByUrl(`cliente/anuncios/visualizar/${item.key}`);
  }

  add(){
    this.route.navigateByUrl('cliente/anuncios/cadastrar');
  }

}
