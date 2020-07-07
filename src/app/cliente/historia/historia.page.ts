import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.page.html',
  styleUrls: ['./historia.page.scss'],
})
export class HistoriaPage implements OnInit {

  constructor(
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
  }

  compartilhar() {
    let option = {
      message: 'Conheça nossa história, compartilhado pelo app Rota SIP:',
      subject: null,
      files: null,
      url: 'https://www.oliberal.com/belem/conheça-a-história-do-município-de-santa-izabel-que-homenageia-uma-mulher-comum-e-vítima-do-machismo-1.48267'
    };
    this.socialSharing.shareWithOptions(option).then(() => {
      console.log('processou mensagem');
      
    })
  }

}
