import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { DataService } from '../../services/data.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public netFlix: Array<any>;
  public amazon: Array<any>;
  public disney: Array<any>;
  public error: any;
  public info: boolean = false;
  public netFlixSlide: Array<any> = [];
  public amzSlide: Array<any> = [];
  public disneySlide: Array<any> = [];
  public netFlixDetails: Array<any> = [];
  public netFlixCredits: Array<any> = [];
  public amazonDetails: Array<any> = [];
  public amazonCredits: Array<any> = [];
  public disneyDetails: Array<any> = [];
  public disneyCredits: Array<any> = [];
  public myMovies: string = 'nf';
  public title: string = 'netflix';
  public apiKey: string = '';
  public apiRoot: string = '';
  public nfUrl: string = '';
  public amzUrl: string = '';
  public dPlusUrl: string = '';
  public submitting: boolean = true;

  constructor(private http: HttpClient, 
    private dataService: DataService) {

      this.dataService
        .getEnv().subscribe(res => {
        console.log(res, 'token');
        let bytes  = CryptoJS.AES.decrypt(res, 'movieTime');
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        this.apiKey = originalText;
        this.apiRoot = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}`;
        this.nfUrl = `${this.apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=en&with_ott_monetization_types=&with_ott_providers=8&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
        this.amzUrl = `${this.apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=9&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
        this.dPlusUrl = `${this.apiRoot}&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=337&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
        this.loadData();
      })

  }

  public createSlideArr(array) {
    let arr = array;
    let n = 5;
    return arr.reduce((r, e, i) =>
      (i % n ? r[r.length - 1].push(e) : r.push([e])) && r, []);
  }

  public async loadData() {

        let promiseNetflix;
        promiseNetflix = new Promise((resolve, reject) => {
          this.http.get(this.nfUrl).subscribe(res =>{
          this.netFlix = res['results'];
          //console.log(this.netFlix, 'got popular netflix movies');
          this.netFlix.forEach((item, index) => {
            item.rank = index + 1;
          });

          this.netFlixSlide = this.createSlideArr(this.netFlix);

          if (this.netFlix.length > 0) {
            
            forkJoin(
              this.netFlix.map(
                m => 
                this.http.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${this.apiKey}&language=en-US`)  
              )
            )
            .subscribe(res => {
              this.netFlixDetails.push(res);
              //console.log(this.netFlixDetails, 'details array');
            })
            
          }

          if (this.netFlix.length > 0) {
            
            forkJoin(
              this.netFlix.map(
                m => 
                this.http.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${this.apiKey}&language=en-US`)  
              )
            )
            .subscribe(res => {
              this.netFlixCredits.push(res);
              //console.log(this.netFlixCredits, 'credits array');
              resolve();
            })
            
          }
            
        }, (err: HttpErrorResponse) => {
          this.error = err.error.status_message;        
          //console.log(err, 'error getting netflix movies');

        });
      }); // End of Netflix promise

      let promiseAmz;
      promiseAmz = new Promise((resolve, reject) => {
        this.http.get(this.amzUrl).subscribe(res => {
          this.amazon = res['results'];
          //console.log(this.amazon, 'got popular amazon movies');
          this.amazon.forEach((item, index) => {
            item.rank = index + 1;
          });
          this.amzSlide = this.createSlideArr(this.amazon);

          if (this.amazon.length > 0) {
            
            forkJoin(
              this.amazon.map(
                m => 
                this.http.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${this.apiKey}&language=en-US`)  
              )
            )
            .subscribe(res => {
              this.amazonDetails.push(res);
              //console.log(this.amazonDetails, 'details array');
              
            })
            
          }

          if (this.amazon.length > 0) {
            
            forkJoin(
              this.amazon.map(
                m => 
                this.http.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${this.apiKey}&language=en-US`)  
              )
            )
            .subscribe(res => {
              this.amazonCredits.push(res);
              //console.log(this.amazonCredits, 'credits array');
              resolve();
            })
            
          }
        }, (err: HttpErrorResponse) => {
          this.error = err.error.status_message;        
          console.log(err, 'error getting amazon movies');

        });
      }); //End amz promise

      let promiseDisney;
      promiseDisney = new Promise((resolve, reject) => {
        this.http.get(this.dPlusUrl).subscribe(res =>{
          this.disney = res['results'];
          //console.log(this.disney, 'got popular disney+ movies movies');
          this.disney.forEach((item, index) => {
            item.rank = index + 1;
          });
          this.disneySlide = this.createSlideArr(this.disney);

          if (this.disney.length > 0) {
            
            forkJoin(
              this.disney.map(
                m => 
                this.http.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${this.apiKey}&language=en-US`)  
              )
            )
            .subscribe(res => {
              this.disneyDetails.push(res);
              //console.log(this.disneyDetails, 'details array');
              
            })
            
          }

          if (this.disney.length > 0) {
            
            forkJoin(
              this.disney.map(
                m => 
                this.http.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${this.apiKey}&language=en-US`)  
              )
            )
            .subscribe(res => {
              this.disneyCredits.push(res);
              //console.log(this.disneyCredits, 'credits array');
              resolve();
            })
            
          }
        }, (err: HttpErrorResponse) => {
          this.error = err.error.status_message;       
          console.log(err, 'error getting disney movies');

        });
      }); //End of disney promise
      let resultOne = await promiseNetflix;
      let resultTwo = await promiseAmz;
      let resultThree = await promiseDisney;
      this.sortData();

  }

  public sortData() {
    //console.log('trying to sort', this.netFlixDetails);
    
    for (let movie of this.netFlix) {
      for (let details of this.netFlixDetails[0]) { 
       
        if (movie.id === details.id) {
          movie.details = details;
        }
      }
    }

    for (let movie of this.netFlix) {
      for (let credits of this.netFlixCredits[0]) { 
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          movie.credit1 = credits.cast[0]['name'];
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
          }
          
        }
      }
    }

    for (let movie of this.amazon) {
      for (let details of this.amazonDetails[0]) { 
       
        if (movie.id === details.id) {
          movie.details = details;
        }
      }
    }

    for (let movie of this.amazon) {
      for (let credits of this.amazonCredits[0]) { 
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          movie.credit1 = credits.cast[0]['name'];
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
          }
          
        }
      }
    }

    for (let movie of this.disney) {
      for (let details of this.disneyDetails[0]) { 
       
        if (movie.id === details.id) {
          movie.details = details;
        }
      }
    }

    for (let movie of this.disney) {
      for (let credits of this.disneyCredits[0]) { 
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          movie.credit1 = credits.cast[0]['name'];
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
          }
          
        }
      }
    }
    this.submitting = false;
  }

  ngOnInit(): void {
    //this.loadData();
  }

  public getSelectedMovies() {
    if (this.myMovies === 'nf') {
      this.title = 'netflix';
      return this.netFlixSlide;
    }
    if (this.myMovies === 'amz') {
      this.title = 'amazon prime';
      return this.amzSlide;
    }
    if (this.myMovies === 'd') {
      this.title = 'disney +';
      return this.disneySlide;
    }
  }

}
