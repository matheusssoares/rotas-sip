import { Component, OnInit } from '@angular/core';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {
  itens: any = [];
  constructor(
    public noticias: NoticiasService,
    public router: Router,
    private nativeStorage: NativeStorage,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
    this.noticias.getNews().subscribe((data) => {
        this.itens = data; 
    })
  }

  visualizar(item){
    this.nativeStorage.setItem('noticia', {noticia: item}).then(() => {
      this.router.navigateByUrl('admin/noticias/visualizar');
    }).catch((err) => {
      console.log('Houve um erro: ', err);
      
    })
  }

  compartilhar(item){
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

}
