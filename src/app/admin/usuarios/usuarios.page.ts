import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  public itens = null;
  public allItens: any;
  constructor(
    private route: Router,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

    this.auth.listar_dados('usuarios', 'firstName').subscribe((data) => {
      this.itens = data;
      this.allItens = this.itens;
    })
  }

  add(){
    this.route.navigateByUrl('admin/usuarios/adicionar');
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

  editar(item){
    this.route.navigateByUrl(`admin/usuarios/editar/${item.key}`);
  }
  excluir(item){
    this.alertCtrl.create({
      header: 'Atenção!',
      message: 'Você deseja excluir este registro?',
      buttons: [
        {
        text: 'Sim',
        handler: () => {
          this.auth.excluir('usuarios', item.key).then(() => {
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

  detalhar(item) {
    console.log(item);
    
  }
}
