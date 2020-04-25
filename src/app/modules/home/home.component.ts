import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

let apiKey = 'enter tmdb api key here';
let apiRoot = "https://api.themoviedb.org/3/discover/movie?api_key="+apiKey;
let nfUrl = apiRoot+"&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=en&with_ott_monetization_types=&with_ott_providers=8&with_release_type=&with_runtime.gte=0&with_runtime.lte=400";
let amzUrl = apiRoot+"&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=9&with_release_type=&with_runtime.gte=0&with_runtime.lte=400";
let dPlusUrl = apiRoot+"&air_date.gte=&air_date.lte=2020-10-14&certification=&certification_country=US&debug=&first_air_date.gte=&first_air_date.lte=&language=en-US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=2020-01-01&release_date.lte=2020-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=0&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=337&with_release_type=&with_runtime.gte=0&with_runtime.lte=400"; 

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
  public disPage: number = 4;
  public disAmount: number = -1;
  public nfPage: number = 4;
  public nfAmount: number = -1;
  public amzPage: number = 4;
  public amzAmount: number = -1;
  public myMovies: string = 'd';
  public title: string = 'disney +';


  constructor(private http: HttpClient) {
     
  }

  public paginateNf(direction) {
    if (direction === 'forward') {
      if (this.nfPage === 4) {
        this.nfPage = 9;
        this.nfAmount = 4;
      } else if (this.nfPage === 9) {
        this.nfPage = 14;
        this.nfAmount = 9;
      } else if (this.nfPage === 14) {
        this.nfPage = 19;
        this.nfAmount = 14;
      } else if (this.nfPage === 19) {
        this.nfPage = 4;
        this.nfAmount = -1;
      }
    }

    if (direction === 'back') {
      if (this.nfPage === 4) {
        this.nfPage = 19;
        this.nfAmount = 14;
      } else if (this.nfPage === 9) {
        this.nfPage = 4;
        this.nfAmount = -1;
      } else if (this.nfPage === 14) {
        this.nfPage = 9;
        this.nfAmount = 4;
      } else if (this.nfPage === 19) {
        this.nfPage = 14;
        this.nfAmount = 9;
      }
    }
    
  }

  public paginateAmz(direction) {
    if (direction === 'forward') {
      if (this.amzPage === 4) {
        this.amzPage = 9;
        this.amzAmount = 4;
      } else if (this.amzPage === 9) {
        this.amzPage = 14;
        this.amzAmount = 9;
      } else if (this.amzPage === 14) {
        this.amzPage = 19;
        this.amzAmount = 14;
      } else if (this.amzPage === 19) {
        this.amzPage = 4;
        this.amzAmount = -1;
      }
    }

    if (direction === 'back') {
      if (this.amzPage === 4) {
        this.amzPage = 19;
        this.amzAmount = 14;
      } else if (this.amzPage === 9) {
        this.amzPage = 4;
        this.amzAmount = -1;
      } else if (this.amzPage === 14) {
        this.amzPage = 9;
        this.amzAmount = 4;
      } else if (this.amzPage === 19) {
        this.amzPage = 14;
        this.amzAmount = 9;
      }
    }
    
  }

  public paginateDis(direction, length) {
    if (direction === 'forward') {
      if (this.disPage === 4) {
        this.disPage = 9;
        this.disAmount = 4;
      } else if (this.disPage === 9) {
        this.disPage = 14;
        this.disAmount = 9;
      } else if (this.disPage === 14) {
        this.disPage = 19;
        this.disAmount = 14;
      } else if (this.disPage === 19) {
        this.disPage = 4;
        this.disAmount = -1;
      }
    }

    if (direction === 'back') {
      if (this.disPage === 4) {
        this.disPage = 19;
        this.disAmount = 14;
      } else if (this.disPage === 9) {
        this.disPage = 4;
        this.disAmount = -1;
      } else if (this.disPage === 14) {
        this.disPage = 9;
        this.disAmount = 4;
      } else if (this.disPage === 19) {
        this.disPage = 14;
        this.disAmount = 9;
      }
    }

    if (length <= this.disAmount) {
      this.disPage = 4;
      this.disAmount = -1;
    }
    
  }

  public createSlideArr(array) {
    let arr = array;
    let n = 5;
    return arr.reduce((r, e, i) =>
      (i % n ? r[r.length - 1].push(e) : r.push([e])) && r, []);
  }

  public loadData() {
    this.http.get(nfUrl).subscribe(res =>{
      this.netFlix = res['results'];
      console.log(this.netFlix, 'got popular netflix movies');
      this.netFlix.forEach((item, index) => {
        item.rank = index + 1;
      });

      this.netFlixSlide = this.createSlideArr(this.netFlix);
      //this.myMovies = 'nf';

      // if (this.netFlix.length > 0) {
        
      //   forkJoin(
      //     this.netFlix.map(
      //       m => 
      //        this.http.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`)  
      //     )
      //   )
      //   .subscribe(res => {
      //     this.netFlixDetails.push(res);
      //     console.log(this.netFlixDetails, 'details array');
          
      //   })
        
      // }

      // if (this.netFlix.length > 0) {
        
      //   forkJoin(
      //     this.netFlix.map(
      //       m => 
      //        this.http.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`)  
      //     )
      //   )
      //   .subscribe(res => {
      //     this.netFlixCredits.push(res);
      //     console.log(this.netFlixCredits, 'credits array');
      //     this.sortData();
      //   })
        
      // }
        
    }, (err: HttpErrorResponse) => {
      this.error = err.error.status_message;        
      console.log(err, 'error getting netflix movies');

    });

    this.http.get(amzUrl).subscribe(res =>{
      this.amazon = res['results'];
      console.log(this.amazon, 'got popular amazon movies');
      this.amazon.forEach((item, index) => {
        item.rank = index + 1;
      });
      this.amzSlide = this.createSlideArr(this.amazon);

      // if (this.amazon.length > 0) {
        
      //   forkJoin(
      //     this.amazon.map(
      //       m => 
      //        this.http.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`)  
      //     )
      //   )
      //   .subscribe(res => {
      //     this.amazonDetails.push(res);
      //     console.log(this.amazonDetails, 'details array');
          
      //   })
        
      // }

      // if (this.amazon.length > 0) {
        
      //   forkJoin(
      //     this.amazon.map(
      //       m => 
      //        this.http.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`)  
      //     )
      //   )
      //   .subscribe(res => {
      //     this.amazonCredits.push(res);
      //     console.log(this.amazonCredits, 'credits array');
      //     this.sortData();
      //   })
        
      // }
    }, (err: HttpErrorResponse) => {
      this.error = err.error.status_message;        
      console.log(err, 'error getting amazon movies');

    });

    this.http.get(dPlusUrl).subscribe(res =>{
      this.disney = res['results'];
      console.log(this.disney, 'got popular disney+ movies movies');
      this.disney.forEach((item, index) => {
        item.rank = index + 1;
      });
      this.disneySlide = this.createSlideArr(this.disney);

      // if (this.disney.length > 0) {
        
      //   forkJoin(
      //     this.disney.map(
      //       m => 
      //        this.http.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${apiKey}&language=en-US`)  
      //     )
      //   )
      //   .subscribe(res => {
      //     this.disneyDetails.push(res);
      //     console.log(this.disneyDetails, 'details array');
          
      //   })
        
      // }

      // if (this.disney.length > 0) {
        
      //   forkJoin(
      //     this.disney.map(
      //       m => 
      //        this.http.get(`https://api.themoviedb.org/3/movie/${m.id}/credits?api_key=${apiKey}&language=en-US`)  
      //     )
      //   )
      //   .subscribe(res => {
      //     this.disneyCredits.push(res);
      //     console.log(this.disneyCredits, 'credits array');
      //     this.sortData();
      //   })
        
      // }
    }, (err: HttpErrorResponse) => {
      this.error = err.error.status_message;       
      console.log(err, 'error getting disney movies');

    });

  }

  public sortData() {
    console.log('trying to sort', this.netFlixDetails);
    
    // for (let movie of this.netFlix) {
    //   for (let details of this.netFlixDetails[0]) { 
       
    //     if (movie.id === details.id) {
    //       movie.details = details;
    //     }
    //   }
    // }

    // for (let movie of this.netFlix) {
    //   for (let credits of this.netFlixCredits[0]) { 
    //     //console.log(credits, 'credits')
    //     if (movie.id === credits.id) {
    //       movie.credits = credits;
    //       movie.credit1 = credits.cast[0]['name'];
    //       if (credits.cast[1] != null) {
    //         movie.credit2 = credits.cast[1]['name'];
    //       }
          
    //     }
    //   }
    // }

    // for (let movie of this.amazon) {
    //   for (let details of this.amazonDetails[0]) { 
       
    //     if (movie.id === details.id) {
    //       movie.details = details;
    //     }
    //   }
    // }

    // for (let movie of this.amazon) {
    //   for (let credits of this.amazonCredits[0]) { 
    //     //console.log(credits, 'credits')
    //     if (movie.id === credits.id) {
    //       movie.credits = credits;
    //       movie.credit1 = credits.cast[0]['name'];
    //       if (credits.cast[1] != null) {
    //         movie.credit2 = credits.cast[1]['name'];
    //       }
          
    //     }
    //   }
    // }

    // for (let movie of this.disney) {
    //   for (let details of this.disneyDetails[0]) { 
       
    //     if (movie.id === details.id) {
    //       movie.details = details;
    //     }
    //   }
    // }

    // for (let movie of this.disney) {
    //   for (let credits of this.disneyCredits[0]) { 
    //     //console.log(credits, 'credits')
    //     if (movie.id === credits.id) {
    //       movie.credits = credits;
    //       movie.credit1 = credits.cast[0]['name'];
    //       if (credits.cast[1] != null) {
    //         movie.credit2 = credits.cast[1]['name'];
    //       }
          
    //     }
    //   }
    // }

  }

  ngOnInit(): void {
    this.loadData();
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
