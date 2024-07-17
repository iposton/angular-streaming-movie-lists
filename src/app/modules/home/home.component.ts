import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'
import { DataService } from '../../services/data.service'
import { UtilService } from '../../services/util.service'
import { GoogleAnalyticsService } from '../../services/google-analytics.service'
import { DomSanitizer } from '@angular/platform-browser'
import { isPlatformBrowser, DOCUMENT } from '@angular/common'
let myWindow = null

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public netFlix: Array<any>
  public amazon: Array<any>
  public disney: Array<any>
  public hbo: Array<any>
  public hulu: Array<any>
  public apple: Array<any>
  public hboTv: Array<any>
  public huluTv: Array<any>
  public appleTv: Array<any>
 
  public netFlixTv: Array<any>;
  public amazonTv: Array<any>;
  public disneyTv: Array<any>;
  public error: any;
  public info: boolean = false;

  public netFlixDetails: Array<any> = [];
  public netFlixCredits: Array<any> = [];
  public amazonDetails: Array<any> = [];
  public amazonCredits: Array<any> = [];
  public disneyDetails: Array<any> = [];
  public disneyCredits: Array<any> = [];

  public hboDetails: Array<any> = [];
  public hboCredits: Array<any> = [];
  public huluDetails: Array<any> = [];
  public huluCredits: Array<any> = [];
  public appleDetails: Array<any> = [];
  public appleCredits: Array<any> = [];

  public hboTvDetails: Array<any> = [];
  public hboTvCredits: Array<any> = [];
  public huluTvDetails: Array<any> = [];
  public huluTvCredits: Array<any> = [];
  public appleTvDetails: Array<any> = [];
  public appleTvCredits: Array<any> = [];

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
  public year: string = '24';
  public provider: string = 'npy';
  public genre: string = '';
  public related: Array<any>;
  public relatedDetails: Array<any>;
  public relatedCredits: Array<any>;
  public providers: Array<any>;
  public gTop: boolean = true;
  public gBottom: boolean = false;
  public showRank: boolean = true;
  public testBrowser: boolean
  public showTrailer: boolean
  public loading: boolean 
  public defaultYear: string

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private gaService: GoogleAnalyticsService,
    public util: UtilService,
    @Inject(PLATFORM_ID) platformId: string,
    @Inject(DOCUMENT) private document: Document
    
  ) {
    this.testBrowser = isPlatformBrowser(platformId)
    this.showTrailer = false
    this.defaultYear = '24'
  }

  public onChange(cat: string) {
    this.dataService.type = cat
    this.type = cat
    if (this.netFlix.length === 0 || this.netFlixTv.length === 0 || this.year != '22' || this.genre != '') {
      this.genre = ''
      this.defaultYear = '24'
      this.provider = 'npy'
      this.year = '24'
      this.loadItems()
    }
  }

  public onYearChange(year: string) {
    if (this.year != year) {
      this.year = year
      this.provider = 'npy'
      this.loadItems()
    }
    
  }

  public onProviderChange(provider: string) {
    if (this.provider != provider) {
      this.util.loadingMore = true
      this.netFlixTv = null
      //this.genre = '';
      this.provider = provider
      this.loadItems()
    } 
   }

  public setGenre(genre: string) {
    this.provider = 'npy'
    if (this.genre != genre) {
      this.genre = genre
      this.loadItems()
    } else if (this.genre == genre) {
      this.genre = ''
      this.loadItems()
    } 
  }

  public loadItems() {
    this.submitting = this.util.loadingMore === true ? false : true
    //this.type = 'movies';
    this.dataService.getData(this.year, this.genre, this.provider).subscribe(res => {
      console.log(res, 'movies from server');
      this.netFlix = res[0].nfMovies;
      this.amazon = res[0].amzMovies;
      this.disney = res[0].disneyMovies;
      this.netFlixCredits = res[0].nfCredits;
      this.netFlixDetails = res[0].nfDetails;
      this.amazonCredits = res[0].amzCredits;
      this.amazonDetails = res[0].amzDetails;
      this.disneyCredits = res[0].disneyCredits;
      this.disneyDetails = res[0].disneyDetails;

      this.hbo = res[0].hboMovies;
      this.hulu = res[0].huluMovies;
      this.apple = res[0].appleMovies;
      this.hboCredits = res[0].hboCredits;
      this.hboDetails = res[0].hboDetails;
      this.huluCredits = res[0].huluCredits;
      this.huluDetails = res[0].huluDetails;
      this.appleCredits = res[0].appleCredits;
      this.appleDetails = res[0].appleDetails;

      this.rank(this.netFlix)
      this.rank(this.amazon)
      this.rank(this.disney)
      this.rank(this.hbo)
      this.rank(this.hulu)
      this.rank(this.apple)

      this.netFlixTv = res[0].nfTv;
      this.amazonTv = res[0].amzTv;
      this.disneyTv = res[0].disneyTv;
      this.netFlixTvCredits = res[0].nfTvCredits;
      this.netFlixTvDetails = res[0].nfTvDetails;
      this.amazonTvCredits = res[0].amzTvCredits;
      this.amazonTvDetails = res[0].amzTvDetails;
      this.disneyTvCredits = res[0].disneyTvCredits;
      this.disneyTvDetails = res[0].disneyTvDetails;

      this.hboTv = res[0].hboTv;
      this.huluTv = res[0].huluTv;
      this.appleTv = res[0].appleTv;
      this.hboTvCredits = res[0].hboTvCredits;
      this.hboTvDetails = res[0].hboTvDetails;
      this.huluTvCredits = res[0].huluTvCredits;
      this.huluTvDetails = res[0].huluTvDetails;
      this.appleTvCredits = res[0].appleTvCredits;
      this.appleTvDetails = res[0].appleTvDetails;
      this.rank(this.netFlixTv);
      this.rank(this.amazonTv);
      this.rank(this.disneyTv);
      this.rank(this.hboTv);
      this.rank(this.huluTv);
      this.rank(this.appleTv);

      this.sortData()
    })
  }

  public rank(array) {
    array.forEach((item, index) => {
      item.rank = index + 1;
    });
  }

  public sortData() {
    try {
      this.util.relatedInfo(this.netFlix, this.netFlixDetails, 'details', 'movies', this.provider, 1)
      this.util.relatedInfo(this.netFlix, this.netFlixCredits, 'credits', 'movies', this.provider, 1)
      this.util.relatedInfo(this.amazon, this.amazonDetails, 'details', 'movies', this.provider, 2)
      this.util.relatedInfo(this.amazon, this.amazonCredits, 'credits', 'movies', this.provider, 2)
      this.util.relatedInfo(this.disney, this.disneyDetails, 'details', 'movies', this.provider, 3)
      this.util.relatedInfo(this.disney, this.disneyCredits, 'credits', 'movies', this.provider, 3)

      this.util.relatedInfo(this.hbo, this.hboDetails, 'details', 'movies', this.provider, 1)
      this.util.relatedInfo(this.hbo, this.hboCredits, 'credits', 'movies', this.provider, 1)
      this.util.relatedInfo(this.hulu, this.huluDetails, 'details', 'movies', this.provider, 2)
      this.util.relatedInfo(this.hulu, this.huluCredits, 'credits', 'movies', this.provider, 2)
      this.util.relatedInfo(this.apple, this.appleDetails, 'details', 'movies', this.provider, 3)
      this.util.relatedInfo(this.apple, this.appleCredits, 'credits', 'movies', this.provider, 3)

      this.util.relatedInfo(this.netFlixTv, this.netFlixTvDetails, 'details', 'tv', this.provider, 1)
      this.util.relatedInfo(this.netFlixTv, this.netFlixTvCredits, 'credits', 'tv', this.provider, 1)
      this.util.relatedInfo(this.amazonTv, this.amazonTvDetails, 'details', 'tv', this.provider, 2)
      this.util.relatedInfo(this.amazonTv, this.amazonTvCredits, 'credits', 'tv', this.provider, 2)
      this.util.relatedInfo(this.disneyTv, this.disneyTvDetails, 'details', 'tv', this.provider, 3)
      this.util.relatedInfo(this.disneyTv, this.disneyTvCredits, 'credits', 'tv', this.provider, 3)

      this.util.relatedInfo(this.hboTv, this.hboTvDetails, 'details', 'tv', this.provider, 1)
      this.util.relatedInfo(this.hboTv, this.hboTvCredits, 'credits', 'tv', this.provider, 1)
      this.util.relatedInfo(this.huluTv, this.huluTvDetails, 'details', 'tv', this.provider, 2)
      this.util.relatedInfo(this.huluTv, this.huluTvCredits, 'credits', 'tv', this.provider, 2)
      this.util.relatedInfo(this.appleTv, this.appleTvDetails, 'details', 'tv', this.provider, 3)
      this.util.relatedInfo(this.appleTv, this.appleTvCredits, 'credits', 'tv', this.provider, 3)
      this.submitting = false
      this.util.loadingMore = false
    } catch (e) {
      console.log(e, 'error');
    }
    
  }

  ngOnInit(): void {
    
    if (this.testBrowser) {
      myWindow = document.defaultView
      this.loadItems();
      this.dataService.type = this.type
      try {
        if (myWindow.innerWidth <= 500) {
          this.isMobile = true;
        } else {
          //console.log('isMobile?', this.isMobile);
        }
      } catch (e) {
        console.log(e, 'window error');
      }
    }
  }

  public goTo() {
    document.querySelector("div[id=top]").scrollIntoView();
  }

  public openTrailer(movie) {
    console.log(movie, 'open trailer')
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
