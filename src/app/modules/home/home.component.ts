import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
let apiKey = 'enter TMDB api key here';
let apiRoot = "https://api.themoviedb.org/3/discover/movie?api_key="+apiKey;
let nfUrl = apiRoot+"&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=en&with_ott_monetization_types=&with_ott_providers=8&with_release_type=&with_runtime.gte=0&with_runtime.lte=400";
let amzUrl = apiRoot+"&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=9&with_release_type=&with_runtime.gte=0&with_runtime.lte=400";
let dPlusUrl = apiRoot+"&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=337&with_release_type=&with_runtime.gte=0&with_runtime.lte=400";; 

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

  constructor(private http: HttpClient) {
    
  }

  public loadData() {
    this.http.get(nfUrl).subscribe(res =>{
      this.netFlix = res['results'];
      console.log(this.netFlix, 'got popular netflix movies');
    }, (err: HttpErrorResponse) => {
      this.error = err.error.status_message;       
      console.log(err, 'error getting netflix movies');

    });

    this.http.get(amzUrl).subscribe(res =>{
      this.amazon = res['results'];
      console.log(this.amazon, 'got popular amazon movies');
    }, (err: HttpErrorResponse) => {
      this.error = err.error.status_message;        
      console.log(err, 'error getting amazon movies');

    });

    this.http.get(dPlusUrl).subscribe(res =>{
      this.disney = res['results'];
      console.log(this.disney, 'got popular disney+ movies movies');
    }, (err: HttpErrorResponse) => {
      this.error = err.error.status_message;       
      console.log(err, 'error getting disney movies');

    });
  }

  ngOnInit(): void {
    this.loadData();
  }

}
