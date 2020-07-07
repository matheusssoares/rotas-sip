import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  public itens:any = [];
  public allItens: any;
  nome: any;
  constructor(
    private router: ActivatedRoute,
    private loadCtrl: LoadingController,
    private auth: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
    this.loadCtrl.create({
      message: 'Carregando, aguarde...',
    }).then((l) => {
      l.present();
      this.auth.listar_dados_id(this.router.snapshot.paramMap.get('key'), 'tipos-estabelecimentos','key')
      .subscribe((data: any) => {
        this.nome =  data[0].nome;
        this.listar_dados(data[0].nome);  
      })

    });
    
  }

  listar_dados(nome){
    this.auth.listar_dados_id(nome, 'estabelecimentos', 'tipo').subscribe((data: any) => {
      this.itens = data;
      this.allItens = this.itens;    
      
      this.loadCtrl.dismiss();
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

  detalhar(item) {
    this.route.navigateByUrl(`cliente/locais/detalhes/${item.key}`);
  }

  add(){
    this.route.navigateByUrl('cliente/locais/adicionar');
  }

}
