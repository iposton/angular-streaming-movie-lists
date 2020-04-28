import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
//import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public env: any;

  constructor(private http: HttpClient) { }

  getEnv() {
    try {
      this.env = this.http.get('/heroku-env')
      return this.env;
    } catch (e) {
      console.log(e, 'error')
    }
  }
}
