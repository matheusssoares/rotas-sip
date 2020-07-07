import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {
  public news: any = {};
  constructor(private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem('noticia')
      .then(data => {
        this.news = data;
        console.log(this.news);
                
      },
        error => console.error(error)
      );
  }

  ngOnInit() {
  }

  ionViewWillLeave(){
    this.news = null;
    this.nativeStorage.remove('noticia').then(() => {
      console.log('cache excluido');
      
    }).catch((err) => {
      console.log('error:', err);
      
    })
  }

}
