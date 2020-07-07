import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-estabelecimentos',
  templateUrl: './estabelecimentos.page.html',
  styleUrls: ['./estabelecimentos.page.scss'],
})
export class EstabelecimentosPage implements OnInit {
  public itens = null;
  public allItens: any;
  segmento: any = 'todos';
  constructor(
    private route: Router,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.auth.listar_dados('estabelecimentos', 'nome').subscribe((data) => {
      this.itens = data;
      this.allItens = this.itens;
    })
  }

  add() {
    this.route.navigateByUrl('admin/estabelecimentos/adicionar');
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

  detalhar(item) {
    this.route.navigateByUrl(`admin/estabelecimentos/detalhes/${item.key}`);
  }
  editar(item) {
    //console.log(item);
    this.route.navigateByUrl(`admin/estabelecimentos/editar/${item.key}`);
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
          this.auth.excluir('estabelecimentos', item.key).then(() => {
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

  eventos_change(ev: any){
    if (ev.detail.value === 'todos') {
      this.listar_todos();
    } else {
      this.listar_pendentes();
    }
  }

  listar_todos(){
    this.auth.db.collection('estabelecimentos', ref => ref.orderBy('nome', 'asc'))
    .valueChanges().subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;
    });
  }

  listar_pendentes(){
    this.auth.db.collection('estabelecimentos', ref => ref.where('ativo', '==', false)
    .orderBy('nome', 'asc')).valueChanges().subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;
    })
  }

}
