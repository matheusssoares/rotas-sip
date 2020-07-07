import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  constructor(private http: HttpClient) { }

  getNews(){  
    return this.http.get('http://newsapi.org/v2/top-headlines?country=br&apiKey=f8ae353b64d74200ae2a28ae103beffd')
  }
}
