import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UtilService } from '../../services/util.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public netFlix: Array<any>;
  public amazon: Array<any>;
  public disney: Array<any>;
  public netFlixTv: Array<any>;
  public amazonTv: Array<any>;
  public disneyTv: Array<any>;
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
  public netFlixTvSlide: Array<any> = [];
  public amzTvSlide: Array<any> = [];
  public disneyTvSlide: Array<any> = [];
  public netFlixTvDetails: Array<any> = [];
  public netFlixTvCredits: Array<any> = [];
  public amazonTvDetails: Array<any> = [];
  public amazonTvCredits: Array<any> = [];
  public disneyTvDetails: Array<any> = [];
  public disneyTvCredits: Array<any> = [];
  public myMovies: string = 'nf';
  public type: string = 'movies';
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
  public dialogUrl: any;
  public selectedMovie: any;
  public selected: any;
  public year: string = '22';
  public provider: string = 'npy';
  public genre: string = "";
  public related: Array<any>;
  public relatedDetails: Array<any>;
  public relatedCredits: Array<any>;
  public providers: Array<any>;
  public gTop: boolean = true;
  public gBottom: boolean = false;
  public showRank: boolean = true;
  public hoveredItem: string = '';
  public hoverRank: number = 99;
  public testBrowser: boolean;
  public showTrailer: boolean;
  public loading: boolean;

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private gaService: GoogleAnalyticsService,
    public util: UtilService,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.testBrowser = isPlatformBrowser(platformId);
    this.showTrailer = false;
    //this.loadMovies();
  }

  public onChange(cat: string) {
    this.dataService.type = cat
    if (cat === 'tv') {
      if (this.netFlixTv == null)
        this.loadTv();
      else
        this.type = cat;
    } else {
      this.type = cat;
      if (this.netFlix == null) {
        this.loadMovies();
      }
    }
  }

  public onYearChange(year: string) {
    if (this.year != year && this.type === 'movies') {
      this.year = year;
      this.loadMovies();
    } else if (this.year != year && this.type === 'tv') {
      this.year = year;
      this.loadTv();
    }
  }

  public onProviderChange(provider: string) {
    if (this.provider != provider && this.type === 'movies') {
      this.netFlixTv = null
      this.genre = '';
      this.provider = provider;
      this.loadMovies();
    } else if (this.provider != provider && this.type === 'tv') {
      this.netFlix = null;
      this.genre = '';
      this.provider = provider;
      this.loadTv();
    }
  }

  public setGenre(genre: string) {
    if (this.genre != genre && this.type === 'movies') {
      this.genre = genre;
      this.loadMovies();
    } else if (this.genre != genre && this.type === 'tv') {
      this.genre = genre;
      this.loadTv();
    } else if (this.genre == genre && this.type === 'movies') {
      this.genre = '';
      this.loadMovies();
    } else if (this.genre == genre && this.type === 'tv') {
      this.genre = '';
      this.loadTv();
    }
  }

  public loadMovies() {
    this.submitting = true;
    this.type = 'movies';
    this.dataService.getData(this.year, this.genre, this.provider).subscribe(res => {
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

  public loadTv() {
    this.submitting = true;
    this.type = 'tv';
    this.dataService.getTv(this.year, this.genre, this.provider).subscribe(res => {
      //console.log(res, 'tv from server');
      this.netFlixTv = res[0].nfTv;
      this.amazonTv = res[0].amzTv;
      this.disneyTv = res[0].disneyTv;
      this.netFlixTvCredits = res[0].nfTvCredits;
      this.netFlixTvDetails = res[0].nfTvDetails;
      this.amazonTvCredits = res[0].amzTvCredits;
      this.amazonTvDetails = res[0].amzTvDetails;
      this.disneyTvCredits = res[0].disneyTvCredits;
      this.disneyTvDetails = res[0].disneyTvDetails;
      this.rank(this.netFlixTv);
      this.rank(this.amazonTv);
      this.rank(this.disneyTv);
      this.netFlixTvSlide = this.createSlideArr(this.netFlixTv);
      this.amzTvSlide = this.createSlideArr(this.amazonTv);
      this.disneyTvSlide = this.createSlideArr(this.disneyTv);
      this.sortTv();
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
      this.util.relatedInfo(this.netFlix, this.netFlixDetails, 'details', 'movies', this.provider, 1)
      this.util.relatedInfo(this.netFlix, this.netFlixCredits, 'credits', 'movies', this.provider, 1)
      this.util.relatedInfo(this.amazon, this.amazonDetails, 'details', 'movies', this.provider, 2)
      this.util.relatedInfo(this.amazon, this.amazonCredits, 'credits', 'movies', this.provider, 2)
      this.util.relatedInfo(this.disney, this.disneyDetails, 'details', 'movies', this.provider, 3)
      this.util.relatedInfo(this.disney, this.disneyCredits, 'credits', 'movies', this.provider, 3)
      this.submitting = false;
    } catch (e) {
      console.log(e, 'error');
    }
    
  }

  public sortTv() {
    try {
      this.util.relatedInfo(this.netFlixTv, this.netFlixTvDetails, 'details', 'tv', this.provider, 1)
      this.util.relatedInfo(this.netFlixTv, this.netFlixTvCredits, 'credits', 'tv', this.provider, 1)
      this.util.relatedInfo(this.amazonTv, this.amazonTvDetails, 'details', 'tv', this.provider, 2)
      this.util.relatedInfo(this.amazonTv, this.amazonTvCredits, 'credits', 'tv', this.provider, 2)
      this.util.relatedInfo(this.disneyTv, this.disneyTvDetails, 'details', 'tv', this.provider, 3)
      this.util.relatedInfo(this.disneyTv, this.disneyTvCredits, 'credits', 'tv', this.provider, 3)
      this.submitting = false;
    } catch (e) {
      console.log(e, 'error');
    }
  }

  ngOnInit(): void {
    if (this.testBrowser) {
      this.loadMovies();
      this.dataService.type = this.type
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
  }

  public getSelectedMovies() {
    if (this.myMovies === 'nf') {
      // this.gaService.eventEmitter("netflix", "popular", "movies", "click", 10);
      this.title = this.provider === 'npy' ? 'netflix' : this.provider === 'hha' ? 'hbo' : 'netflix kids';
      if (this.isMobile) {
        if (this.type === 'movies') {
          return this.netFlix;
        } else {
          return this.netFlixTv;
        } 
      } else {
        if (this.type === 'movies') {
          return this.netFlixSlide;
        } else {
          return this.netFlixTvSlide;
        }  
      }
    }
    if (this.myMovies === 'amz') {
      // this.gaService.eventEmitter("primevideo", "popular", "movies", "click", 10);
      this.title = this.provider === 'npy' ? 'amazon prime' : this.provider === 'hha' ? 'hulu' : 'disney +';
      if (this.isMobile) {
        if (this.type === 'movies') {
          return this.amazon;
        } else {
          return this.amazonTv;
        } 
      } else {
        if (this.type === 'movies') {
          return this.amzSlide;
        } else {
          return this.amzTvSlide;
        } 
      }
    }
    if (this.myMovies === 'd') {
      // this.gaService.eventEmitter("disney", "popular", "movies", "click", 10);
      this.title = this.provider === 'npy' ? 'youtube tv' : this.provider === 'hha' ? 'apple tv' : 'pbs kids';
      if (this.isMobile) {
        if (this.type === 'movies') {
          return this.disney;
        } else {
          return this.disneyTv;
        } 
      } else {
        if (this.type === 'movies') {
          return this.disneySlide;
        } else {
          return this.disneyTvSlide;
        } 
      }
    }
  }

  public goTo() {
    document.querySelector("div[id=top]").scrollIntoView();
  }

  public openTrailer(movie, cat) {
    this.dataService.type = this.type === 'tv' ? 'tv' : 'movie'
    this.loading = true
    this.selectedMovie = movie
    this.isOpen = true
    //this.goTo();
      this.dataService.search(movie.id).subscribe(res => {
        console.log(res, 'trailer res')
        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
            this.dialogUrl = this.trailerUrl;
            console.log(this.trailerUrl, 'movie trailer');
            
          }
         
        if (res['related'][0] != null) {
            // let element = document.getElementById('top');    
            // element.scrollIntoView(true);
            this.providers = res['providers']
            this.relatedDetails = res['details']
            this.relatedCredits = res['credits']
            this.related = res['related']
            this.selected = this.selectedMovie
            this.loading = false
            this.showTrailer = true

            this.util.recommend(this.related, this.providers, this.relatedDetails, this.relatedCredits)
            
          } else if (res['related'][0] == null) {
            this.selected = this.selectedMovie
            this.loading = false
            this.showTrailer = true
          }
        }
      });
    
  }
}
