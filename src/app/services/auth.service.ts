import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public db: AngularFirestore, 
    public auth: AngularFireAuth, 
    public route: Router,
    public fs: AngularFireStorage
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          console.log('acesso proibido!');
          this.route.navigate(['/home']);
          resolve(false);
        }
      });
    })
  }

  cadastrar(collection, dados){
    return this.db.collection(`${collection}`).doc(dados.key).set(dados);
  }

  validar_dados(nome, collection, caminho){
    return new Promise((resolve, reject) => {
      this.db.collection(`${collection}`, ref => ref.where(`${caminho}`, '==', `${nome}`)).get().toPromise().then((data) => {
        if(data.docs.length == 0){
          resolve(false);
        } else {
          resolve(true);
        }
      })
    })
    
  }

  listar_dados(collection, ordenar_por){
    return this.db.collection(`${collection}`, ref => ref.orderBy(`${ordenar_por}`, 'asc')).valueChanges();
  }

  excluir(collection, key){
    return this.db.collection(collection).doc(key).delete();
  }

  atualizar(collection, key, dados){
    return this.db.collection(collection).doc(key).update(dados)
  }

  upload_arquivo(ref, pasta, nome_arquivo, arquivo) {
    return this.fs.storage.ref(ref).child(`${pasta}/${nome_arquivo}`).putString(arquivo, 'data_url');
  }

  listar_dados_id(key, collection, referencia){
    return this.db.collection(`${collection}`, ref => ref.where(`${referencia}`, '==', `${key}`)).valueChanges();
  }
}
