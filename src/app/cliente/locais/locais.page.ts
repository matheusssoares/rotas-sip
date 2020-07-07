import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-locais',
  templateUrl: './locais.page.html',
  styleUrls: ['./locais.page.scss'],
})
export class LocaisPage implements OnInit {
  public itens = null;
  public allItens: any;
  public categorias: Array<any> = [];
  constructor(
    private route: Router,
    private auth: AuthService,
    private loadCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Carregando, aguarde...'
    }).then((l) => {
      l.present();
      this.auth.db.collection('estabelecimentos', ref => ref.where('ativo', '==', true)
      .orderBy('nome', 'asc')).valueChanges().subscribe((data) => {
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

      if(this.itens.length == 0){
        this.itens = this.itens.filter((item) => {
          return (item.tipo.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    } else {
      this.itens = this.allItens;
    }
  }

  detalhar(item) {
    this.route.navigateByUrl(`cliente/locais/detalhes/${item.key}`);
  }

  add(){
    this.route.navigateByUrl('cliente/locais/adicionar');
  }

}
