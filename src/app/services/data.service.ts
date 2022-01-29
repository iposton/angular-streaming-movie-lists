import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const headers = new HttpHeaders().set('Content-Type', 'application/X-www-form-urlencoded');

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public movies: any;
  public tv: any;
  public result: any;
  public searchRes: any;
  public trending: any;
  public type: string = '';

  constructor(private http: HttpClient) { }

  getData(item, genre, pro) {
    let searchterm = `query=${item}&genre=${genre}&pro=${pro}`;
    try {
      this.movies = this.http.post('/data', searchterm, {headers});
      return this.movies;
    } catch (e) {
      console.log(e, 'error')
    }
  }

  getTv(item, genre, pro) {
    let searchterm = `query=${item}&genre=${genre}&pro=${pro}`;
    try {
      this.tv = this.http.post('/tv', searchterm, {headers});
      return this.tv;
    } catch (e) {
      console.log(e, 'error')
    }
  }

  search(item) {
    let searchterm = `query=${item}&cat=${this.type}`;
    try {
      this.result = this.http.post('/search', searchterm, {headers});
      return this.result;
    } catch (e) {
      console.log(e, 'error')
    }
  }

  searchtv(item) {
    let searchterm = `query=${item}`;
    try {
      this.result = this.http.post('/searchtv', searchterm, {headers});
      return this.result;
    } catch (e) {
      console.log(e, 'error')
    }
  }

  searchTrending(item) {
    let searchterm = `query=${item}&cat=${this.type}`;
    try {
      this.searchRes = this.http.post('/searchtrending', searchterm, {headers});
      return this.searchRes;
    } catch (e) {
      console.log(e, 'error')
    }
  }

  getTrending(): Observable<any> {
    try {
      this.trending = this.http.post('/trending', {headers});
      return this.trending;
    } catch (e) {
      console.log(e, 'error')
    }
  }
}
