import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DataService } from './services/data.service';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isOpen: boolean = false;
  public isSearchOpen: boolean = false;
  public isRemOpen: boolean = false;
  public title = 'Streaming Lists | Netflix, Prime, Disney+, HBO, HULU';
  public dialogTitle: string = '';
  public reminders: any;
  public currentItem: string;
  public content: string;
  public loading: boolean;
  public loadingTitle: string;
  public selectedMovie: any;
  public selected: any;
  public selectedTV: any;
  public trailerUrl: any;
  public dialogUrl: any;
  public trailerUrlTV: any;
  public showTrailer: any;
  public menu: boolean = false;
  public mobile: boolean = false;
  constructor(
    private metaTagService: Meta,
    private titleService: Title,
    public dataService: DataService,
    private util: UtilService
  ) { }

  public navigate(link) {
    window.location.href = link;
  }

  public openSearch() {
    this.isSearchOpen = true;
  }

  public open(type: string) {
    this.loading = true;
    
    this.reminders = [];
    if (type === 'trending') {
      this.loadingTitle = 'Trending Movies';
      //this.reminders = this.dataService.getTrending();
      this.content = 'movies';
      this.dialogTitle = 'Trending';
      this.isRemOpen = true;
      this.dataService.getTrending().subscribe(res => { 
        this.util.relatedInfo(res[0].movies, res[0].mvCredits, 'credits', 'movies', '', 0)
        this.util.relatedInfo(res[0].movies, res[0].mvDetails, 'details', 'movies', '', 0)
        this.util.relatedInfo(res[0].movies, res[0].mvProviders, 'providers', 'movies', '', 0)
        this.util.relatedInfo(res[0].tv, res[0].tvCredits, 'credits', 'tv', '', 0)
        this.util.relatedInfo(res[0].tv, res[0].tvDetails, 'details', 'tv', '', 0)
        this.util.relatedInfo(res[0].tv, res[0].tvProviders, 'providers', 'tv', '', 0)
        this.selectedMovie = this.util.getFlatRate(res[0].movies);
        
        this.dataService.search(this.selectedMovie.id).subscribe(r => {
          if (r['results'][0] != null) {
            if (r['results'][0].site === 'YouTube') {
              this.trailerUrl = this.util.sanitize(r['results'][0])
              this.dialogUrl = this.trailerUrl;
              console.log(this.trailerUrl, 'movie trailer');
            }
            
            this.showTrailer = true;
          }  

        this.selectedTV = this.util.getFlatRate(res[0].tv);
        this.dataService.searchtv(this.selectedTV.id).subscribe(t => {
          if (t['results'][0] != null) {
            if (t['results'][0].site === 'YouTube') {
              this.trailerUrlTV = this.util.sanitize(t['results'][0])
              // console.log(this.trailerUrlTV, 'whats up');
            }
          }     
        })

          this.selected = this.selectedMovie;
          console.log(this.selected, 'selected movie')
          this.reminders = res[0];
          this.loading = false;
        })

        
        
        console.log('trending', res[0]);
        
      });
      
    } else if (type === 'favorites') {

      this.loadingTitle = 'Favorites'
      this.selected = null
      this.showTrailer = false
      this.content = 'favorite'
      this.dialogTitle = 'Favorites'
      this.isRemOpen = true
      this.currentItem = (localStorage.getItem('favorites')!= undefined) ? JSON.parse(localStorage.getItem('favorites')) : []
      //this.selected = this.currentItem != null ? this.currentItem[0]['newReminder'] : null;
      //this.dataService.type = this.selected.media_type
      this.reminders = this.currentItem
     
        setTimeout(() => {
          this.loading = false
        }, 1000) 

    } else {
      this.loadingTitle = 'Reminders'
      this.selected = null
      this.showTrailer = false
      this.content = 'newReminder'
      this.dialogTitle = 'Reminders'
      this.isRemOpen = true
      this.currentItem = (localStorage.getItem('currentItem')!= undefined) ? JSON.parse(localStorage.getItem('currentItem')) : []
      this.selected = this.currentItem != null ? this.currentItem[0]['newReminder'] : null
      this.dataService.type = this.selected.media_type
      try {
        console.log(this.selected, 'getting first item in reminders')
       // if (this.selected.type === 'movies') {
          this.dataService.search(this.selected.id).subscribe(r => {
            if (r['results'][0] != null) {
              if (r['results'][0].site === 'YouTube') {
                this.trailerUrl = this.util.sanitize(r['results'][0])
                this.dialogUrl = this.trailerUrl
              }
              this.showTrailer = true
            }  
            this.reminders = this.currentItem
            this.loading = false
          })
        
      } catch(e) {
        this.loading = false
        console.log('error', e)
      }
    }  
  }

  ngOnInit() {
    if (window.innerWidth < 500) { // 768px portrait
      this.mobile = true;
    }
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      { name: 'description', content: 'Popular movies streaming on netflix, prime video and disney +.' },
      { name: 'keywords', content: 'streaming, movies, netflix' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Ian Poston' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@StreamingLists' },
      { name: 'twitter:title', content: this.title },
      { name: 'twitter:description', content: 'Popular movies streaming on netflix, prime video and disney +.' },
      { name: 'twitter:image', content: 'https://streaminglists.com/assets/images/home-page.png' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Streaming Lists' },
      { property: 'og:title', content: this.title },
      { property: 'og:description', content: 'Popular movies streaming on netflix, prime video and disney +.' },
      { property: 'og:url', content: 'https://streaminglists.com' },
      { property: 'og:image', content: 'https://streaminglists.com/assets/images/home-page.png' }
    ]);
  }
}
