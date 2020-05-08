import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public movies: any;
  public result: any;

  constructor(private http: HttpClient) { }

  getData() {
    try {
      this.movies = this.http.get('/data')
      return this.movies;
    } catch (e) {
      console.log(e, 'error')
    }
  }

  search(item) {
    let headers = new HttpHeaders().set('Content-Type', 'application/X-www-form-urlencoded');
    let searchterm = `query=${item}`;
    try {
      this.result = this.http.post('/search', searchterm, {headers});
      return this.result;
    } catch (e) {
      console.log(e, 'error')
    }
  }
}
