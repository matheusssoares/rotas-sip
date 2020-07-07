import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tipos-estabelecimentos',
  templateUrl: './tipos-estabelecimentos.page.html',
  styleUrls: ['./tipos-estabelecimentos.page.scss'],
})
export class TiposEstabelecimentosPage implements OnInit {
  dados: any = {};
  public itens = [];
  public allItens: any;
  constructor(
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private auth: AuthService

  ) { }

  ngOnInit() {
    this.auth.listar_dados('tipos-estabelecimentos', 'nome').subscribe((data) => {
      this.itens = data;
      this.allItens = this.itens;
    })
  }

  add() {
    this.alertController.create({
      header: 'Adicionar Tipos',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Tipo de estabelecimento'
        },
        {
          name: 'icone',
          type: 'text',
          placeholder: 'Ícone'
        }
      ],
      buttons: [
        {
          text: 'Cadastrar',
          handler: (data) => {
            this.dados.nome = data.nome.toLowerCase().toUpperCase();
            this.dados.icone = data.icone.toLowerCase();
            this.dados.ativo = true;
            this.dados.key = this.auth.db.createId();

            this.loadCtrl.create({
              message: 'Cadastrando, aguarde...'
            }).then((l) => {
              l.present();

              this.auth.validar_dados(this.dados.nome, 'tipos-estabelecimentos', 'nome').then((data) => {
                if (data) {
                  l.dismiss();
                  this.alertController.create({
                    header: 'Aviso!',
                    message: 'Tipo de estabelecimento já cadastrado, tente outro nome.',
                    buttons: [{
                      text: 'Ok'
                    }]
                  }).then((a) => {
                    a.present();
                  })
                } else {
                  l.dismiss();

                  this.auth.cadastrar('tipos-estabelecimentos', this.dados).then(() => {
                    this.toastCtrl.create({
                      message: 'Tipo cadastrado com sucesso!',
                      duration: 3000
                    }).then((t) => {
                      t.present();
                    })
                  }).catch((err) => {
                    console.log(err);
                  })
                }
              })
            })

          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).then((a) => {
      a.present();
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

  excluir(item) {
    this.alertController.create({
      header: 'Aviso!',
      message: `Você deseja excluir esse tipo de estabelecimento?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.auth.excluir('tipos-estabelecimentos', item.key).then(() => {
              this.toastCtrl.create({
                message: 'Registro excluído com sucesso!',
                duration: 3000
              }).then(t => t.present())
            })
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => alert.present())
  }

  editar(item){
    this.alertController.create({
      header: 'Editar Tipo',
      inputs: [
        {
          id: 'nome',
          type: 'text',
          name: 'nome',
          value: item.nome,
          placeholder: 'Nome do tipo'
        },
        {
          id: 'icone',
          type: 'text',
          name: 'icone',
          value: item.icone,
          placeholder: 'Ícone'
        }
      ],
      buttons: [
        {
          text: 'Atualizar',
          handler: (data) => {
            this.dados.nome = data.nome.toLowerCase().toUpperCase();
            this.dados.icone = data.icone.toLowerCase();
            this.dados.ativo = true;
            this.loadCtrl.create({
              message: 'Atualizando, aguarde...'
            }).then((l) => {
              l.present();

              this.auth.validar_dados(this.dados.nome, 'tipos-estabelecimentos', 'nome').then((data) => {
                if (data) {
                  l.dismiss();
                  this.alertController.create({
                    header: 'Aviso!',
                    message: 'Tipo de estabelecimento já cadastrado, tente outro nome.',
                    buttons: [{
                      text: 'Ok'
                    }]
                  }).then((a) => {
                    a.present();
                  })
                } else {
                  l.dismiss();

                  this.auth.atualizar('tipos-estabelecimentos', item.key, this.dados).then(() => {
                    this.toastCtrl.create({
                      message: 'Tipo atualizado com sucesso!',
                      duration: 3000
                    }).then((t) => {
                      t.present();
                    })
                  }).catch((err) => {
                    console.log(err);
                  })
                }
              })
            })
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).then((a) => {
      a.present();
    })
  }

}
