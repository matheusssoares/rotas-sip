import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.page.html',
  styleUrls: ['./anuncios.page.scss'],
})
export class AnunciosPage implements OnInit {
  anuncio_seg = 'todos';
  itens: any = null;
  public allItens: any;
  constructor(
    private route: Router,
    public auth: AuthService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private loadCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.auth.listar_dados('anuncios', 'data_cadastro').subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;
    })
  }

  add(){
    this.route.navigateByUrl('admin/anuncios/adicionar');
  }

  editar(item) {
    this.route.navigateByUrl(`admin/anuncios/editar/${item.key}`);
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
            this.auth.excluir('anuncios', item.key).then(() => {
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

  anuncio_change(ev: any){
    if (ev.detail.value === 'pendentes') {
      this.loadCtrl.create({
        message: 'Listando anúncios...'
      }).then((l) => {
        l.present();

        this.auth.db.collection('anuncios', ref => ref.where('ativo', '==', false))
          .valueChanges().subscribe((data: any) => {
            this.itens = data;
            this.allItens = this.itens;
            l.dismiss();
          })
      })
    } else {
      this.auth.listar_dados('anuncios', 'data_cadastro').subscribe((data: any) => {
        this.itens = data;
        this.allItens = this.itens;
      })
    }
  }

}
