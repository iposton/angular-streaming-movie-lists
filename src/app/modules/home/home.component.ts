import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

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
  public isMobile: boolean = false;
  public tsDate: any;
  public isOpen: boolean = false;
  public trailerKey: any;
  public trailerUrl: any;
  public selectedMovie: any;

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private gaService: GoogleAnalyticsService
  ) {
    this.dataService.getData().subscribe(res => {
      //console.log(res, 'movies from server');
      this.netFlix = res[0].nfMovies;
      this.amazon = res[0].amzMovies;
      this.disney = res[0].disneyMovies;
      this.netFlixCredits = res[0].nfCredits;
      this.netFlixDetails = res[0].nfDetails;
      this.amazonCredits = res[0].amzCredits;
      this.amazonDetails = res[0].amzDetails;
      this.disneyCredits = res[0].disneyCredits;
      this.disneyDetails = res[0].disneyDetails;
      this.rank(this.netFlix);
      this.rank(this.amazon);
      this.rank(this.disney);
      this.netFlixSlide = this.createSlideArr(this.netFlix);
      this.amzSlide = this.createSlideArr(this.amazon);
      this.disneySlide = this.createSlideArr(this.disney);
      this.sortData();
    });
  }

  public rank(array) {
    array.forEach((item, index) => {
      item.rank = index + 1;
    });
  }

  public createSlideArr(array) {
    let arr = array;
    let n = 5;
    return arr.reduce(
      (r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r,
      []
    );
  }

  public sortData() {
    try {
      for (let movie of this.netFlix) {
        for (let details of this.netFlixDetails) {
          if (movie.id === details.id) {
            movie.details = details;
            movie.rating = Array(Math.round(movie.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let movie of this.netFlix) {
      for (let credits of this.netFlixCredits) {
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          if (credits.cast[0] != null) {
            movie.credit1 = credits.cast[0]['name'];
            movie.credit1Pic = credits.cast[0]['profile_path'];
            movie.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
            movie.credit2Pic = credits.cast[1]['profile_path'];
            movie.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }

    try {
      for (let movie of this.amazon) {
        for (let details of this.amazonDetails) {
          if (movie.id === details.id) {
            movie.details = details;
            movie.rating = Array(Math.round(movie.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let movie of this.amazon) {
      for (let credits of this.amazonCredits) {
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          if (credits.cast[0] != null) {
            movie.credit1 = credits.cast[0]['name'];
            movie.credit1Pic = credits.cast[0]['profile_path'];
            movie.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
            movie.credit2Pic = credits.cast[1]['profile_path'];
            movie.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }

    try {
      for (let movie of this.disney) {
        for (let details of this.disneyDetails) {
          if (movie.id === details.id) {
            movie.details = details;
            movie.rating = Array(Math.round(movie.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let movie of this.disney) {
      for (let credits of this.disneyCredits) {
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          if (credits.cast[0] != null) {
            movie.credit1 = credits.cast[0]['name'];
            movie.credit1Pic = credits.cast[0]['profile_path'];
            movie.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
            movie.credit2Pic = credits.cast[1]['profile_path'];
            movie.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }
    this.submitting = false;
  }

  ngOnInit(): void {
    //this.loadData();
    try {
      if (window.innerWidth <= 500) {
        this.isMobile = true;
      } else {
        //console.log('isMobile?', this.isMobile);
      }
    } catch (e) {
      console.log(e, 'window error');
    }
  }

  public getSelectedMovies() {
    if (this.myMovies === 'nf') {
      this.gaService.eventEmitter("netflix", "popular", "movies", "click", 10);
      this.title = 'netflix';
      if (this.isMobile) {
        return this.netFlix;
      } else {
        return this.netFlixSlide;
      }
    }
    if (this.myMovies === 'amz') {
      this.gaService.eventEmitter("prime video", "popular", "movies", "click", 10);
      this.title = 'amazon prime';
      if (this.isMobile) {
        return this.amazon;
      } else {
        return this.amzSlide;
      }
    }
    if (this.myMovies === 'd') {
      this.gaService.eventEmitter("disney", "popular", "movies", "click", 10);
      this.title = 'disney +';
      if (this.isMobile) {
        return this.disney;
      } else {
        return this.disneySlide;
      }
    }
  }

  public openTrailer(movie) {
    this.selectedMovie = movie;
    this.dataService.search(movie.id).subscribe(res => {

      if (res['results'][0] != null) {
        if (res['results'][0].site === 'YouTube') {
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${res['results'][0].key}`
          );
          this.isOpen = true;
        }
      }
    });
  }
}
