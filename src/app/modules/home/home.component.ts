import { Component, OnInit, Inject, PLATFORM_ID, DOCUMENT, ChangeDetectionStrategy } from '@angular/core'
import { DataService } from '../../services/data.service'
import { UtilService } from '../../services/util.service'
import { GoogleAnalyticsService } from '../../services/google-analytics.service'
import { DomSanitizer } from '@angular/platform-browser'
import { isPlatformBrowser } from '@angular/common'
let myWindow = null

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HomeComponent implements OnInit {
  public readonly movieGenreOptions = [
    { value: '35', label: 'Comedy' },
    { value: '28', label: 'Action' },
    { value: '18', label: 'Drama' },
    { value: '10749', label: 'Romance' },
    { value: '27', label: 'Horror' },
    { value: '99', label: 'Doc' },
    { value: '16', label: 'Animation' },
    { value: '80', label: 'Crime' },
    { value: '10751', label: 'Family' },
    { value: '10402', label: 'Music' },
    { value: '878', label: 'Sci-Fi' },
    { value: '53', label: 'Thriller' },
    { value: '37', label: 'Western' },
    { value: '36', label: 'History' }
  ]
  public readonly tvGenreOptions = [
    { value: '35', label: 'Comedy' },
    { value: '18', label: 'Drama' },
    { value: '99', label: 'Doc' },
    { value: '16', label: 'Animation' },
    { value: '80', label: 'Crime' },
    { value: '10751', label: 'Family' },
    { value: '10759', label: 'Action & Adventure' },
    { value: '9648', label: 'Mystery' },
    { value: '10765', label: 'Sci-Fi & Fantasy' },
    { value: '10768', label: 'War & Politics' },
    { value: '37', label: 'Western' }
  ]
  public netflixMovies: Array<any> = []
  public primeMovies: Array<any> = []
  public disneyMovies: Array<any> = []
  public maxMovies: Array<any> = []
  public huluMovies: Array<any> = []
  public appleMovies: Array<any> = []
  public maxTvShows: Array<any> = []
  public huluTvShows: Array<any> = []
  public appleTvShows: Array<any> = []
 
  public netflixTvShows: Array<any> = [];
  public primeTvShows: Array<any> = [];
  public disneyTvShows: Array<any> = [];
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
  public year: string = '26';
  public providerGroup: string = 'npy';
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
  public genreMenuOpen: boolean

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
    this.defaultYear = '26'
    this.genreMenuOpen = false
	  }

  public get genreOptions() {
    return this.type === 'tv' ? this.tvGenreOptions : this.movieGenreOptions
  }

  public get activeGenreLabel() {
    const activeGenre = this.genreOptions.find(option => option.value === this.genre)
    return activeGenre ? activeGenre.label : 'Genres'
  }

  public onChange(cat: string) {
    this.dataService.type = cat
    this.type = cat
    this.closeGenreMenu()
    if (this.netflixMovies.length === 0 || this.netflixTvShows.length === 0 || this.year != '22' || this.genre != '') {
      this.genre = ''
      this.defaultYear = '26'
      this.providerGroup = 'npy'
      this.year = '26'
      this.loadItems()
    }
  }

  public onYearChange(year: string) {
    if (this.year != year) {
      this.year = year
      this.providerGroup = 'npy'
      this.closeGenreMenu()
      this.loadItems()
    }
    
  }

  public onProviderChange(providerGroup: string) {
    if (this.providerGroup != providerGroup) {
      this.util.loadingMore = true
      this.providerGroup = providerGroup
      this.loadItems()
    } 
   }

  public setGenre(genre: string) {
    this.providerGroup = 'npy'
    if (this.genre != genre) {
      this.genre = genre
      this.loadItems()
    } else if (this.genre == genre) {
      this.genre = ''
      this.loadItems()
    }

    this.closeGenreMenu()
  }

  public openGenreMenu() {
    this.genreMenuOpen = true
    this.toggleBodyScroll(true)
  }

  public closeGenreMenu() {
    this.genreMenuOpen = false
    this.toggleBodyScroll(false)
  }

  public clearGenre() {
    if (this.genre === '') {
      this.closeGenreMenu()
      return
    }

    this.genre = ''
    this.providerGroup = 'npy'
    this.loadItems()
    this.closeGenreMenu()
  }

  public toggleGenreMenu() {
    if (this.genreMenuOpen) {
      this.closeGenreMenu()
      return
    }

    this.openGenreMenu()
  }

  private toggleBodyScroll(isLocked: boolean) {
    if (!this.testBrowser) {
      return
    }

    this.document.body.style.overflow = isLocked ? 'hidden' : ''
  }

  public loadItems() {
    this.submitting = this.util.loadingMore === true ? false : true
    const requestedProviderGroup = this.providerGroup
    this.dataService.getData(this.year, this.genre, this.providerGroup).subscribe(res => {
      console.log(res, 'movies from server');
      if (requestedProviderGroup === 'npy' || requestedProviderGroup === 'nkpkd') {
        this.netflixMovies = res[0].nfMovies;
        this.primeMovies = res[0].amzMovies;
        this.disneyMovies = res[0].disneyMovies;
        this.netFlixCredits = res[0].nfCredits;
        this.netFlixDetails = res[0].nfDetails;
        this.amazonCredits = res[0].amzCredits;
        this.amazonDetails = res[0].amzDetails;
        this.disneyCredits = res[0].disneyCredits;
        this.disneyDetails = res[0].disneyDetails;

        this.netflixTvShows = res[0].nfTv;
        this.primeTvShows = res[0].amzTv;
        this.disneyTvShows = res[0].disneyTv;
        this.netFlixTvCredits = res[0].nfTvCredits;
        this.netFlixTvDetails = res[0].nfTvDetails;
        this.amazonTvCredits = res[0].amzTvCredits;
        this.amazonTvDetails = res[0].amzTvDetails;
        this.disneyTvCredits = res[0].disneyTvCredits;
        this.disneyTvDetails = res[0].disneyTvDetails;
      }

      if (requestedProviderGroup === 'hha') {
        this.maxMovies = res[0].hboMovies;
        this.huluMovies = res[0].huluMovies;
        this.appleMovies = res[0].appleMovies;
        this.hboCredits = res[0].hboCredits;
        this.hboDetails = res[0].hboDetails;
        this.huluCredits = res[0].huluCredits;
        this.huluDetails = res[0].huluDetails;
        this.appleCredits = res[0].appleCredits;
        this.appleDetails = res[0].appleDetails;

        this.maxTvShows = res[0].hboTv;
        this.huluTvShows = res[0].huluTv;
        this.appleTvShows = res[0].appleTv;
        this.hboTvCredits = res[0].hboTvCredits;
        this.hboTvDetails = res[0].hboTvDetails;
        this.huluTvCredits = res[0].huluTvCredits;
        this.huluTvDetails = res[0].huluTvDetails;
        this.appleTvCredits = res[0].appleTvCredits;
        this.appleTvDetails = res[0].appleTvDetails;
      }

      this.rank(this.netflixMovies)
      this.rank(this.primeMovies)
      this.rank(this.disneyMovies)
      this.rank(this.maxMovies)
      this.rank(this.huluMovies)
      this.rank(this.appleMovies)

      this.rank(this.netflixTvShows);
      this.rank(this.primeTvShows);
      this.rank(this.disneyTvShows);
      this.rank(this.maxTvShows);
      this.rank(this.huluTvShows);
      this.rank(this.appleTvShows);

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
      this.util.relatedInfo(this.netflixMovies, this.netFlixDetails, 'details', 'movies', this.providerGroup, 1)
      this.util.relatedInfo(this.netflixMovies, this.netFlixCredits, 'credits', 'movies', this.providerGroup, 1)
      this.util.relatedInfo(this.primeMovies, this.amazonDetails, 'details', 'movies', this.providerGroup, 2)
      this.util.relatedInfo(this.primeMovies, this.amazonCredits, 'credits', 'movies', this.providerGroup, 2)
      this.util.relatedInfo(this.disneyMovies, this.disneyDetails, 'details', 'movies', this.providerGroup, 3)
      this.util.relatedInfo(this.disneyMovies, this.disneyCredits, 'credits', 'movies', this.providerGroup, 3)

      this.util.relatedInfo(this.maxMovies, this.hboDetails, 'details', 'movies', this.providerGroup, 1)
      this.util.relatedInfo(this.maxMovies, this.hboCredits, 'credits', 'movies', this.providerGroup, 1)
      this.util.relatedInfo(this.huluMovies, this.huluDetails, 'details', 'movies', this.providerGroup, 2)
      this.util.relatedInfo(this.huluMovies, this.huluCredits, 'credits', 'movies', this.providerGroup, 2)
      this.util.relatedInfo(this.appleMovies, this.appleDetails, 'details', 'movies', this.providerGroup, 3)
      this.util.relatedInfo(this.appleMovies, this.appleCredits, 'credits', 'movies', this.providerGroup, 3)

      this.util.relatedInfo(this.netflixTvShows, this.netFlixTvDetails, 'details', 'tv', this.providerGroup, 1)
      this.util.relatedInfo(this.netflixTvShows, this.netFlixTvCredits, 'credits', 'tv', this.providerGroup, 1)
      this.util.relatedInfo(this.primeTvShows, this.amazonTvDetails, 'details', 'tv', this.providerGroup, 2)
      this.util.relatedInfo(this.primeTvShows, this.amazonTvCredits, 'credits', 'tv', this.providerGroup, 2)
      this.util.relatedInfo(this.disneyTvShows, this.disneyTvDetails, 'details', 'tv', this.providerGroup, 3)
      this.util.relatedInfo(this.disneyTvShows, this.disneyTvCredits, 'credits', 'tv', this.providerGroup, 3)

      this.util.relatedInfo(this.maxTvShows, this.hboTvDetails, 'details', 'tv', this.providerGroup, 1)
      this.util.relatedInfo(this.maxTvShows, this.hboTvCredits, 'credits', 'tv', this.providerGroup, 1)
      this.util.relatedInfo(this.huluTvShows, this.huluTvDetails, 'details', 'tv', this.providerGroup, 2)
      this.util.relatedInfo(this.huluTvShows, this.huluTvCredits, 'credits', 'tv', this.providerGroup, 2)
      this.util.relatedInfo(this.appleTvShows, this.appleTvDetails, 'details', 'tv', this.providerGroup, 3)
      this.util.relatedInfo(this.appleTvShows, this.appleTvCredits, 'credits', 'tv', this.providerGroup, 3)
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
          this.isMobile = true
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
