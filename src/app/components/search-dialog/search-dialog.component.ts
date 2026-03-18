import { Component, OnInit, Output, EventEmitter, Input, Inject, PLATFORM_ID } from '@angular/core'
import { DataService } from '../../services/data.service'
import { UtilService } from '../../services/util.service'
import { DomSanitizer } from '@angular/platform-browser'
import { isPlatformBrowser } from '@angular/common'

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss'],
    standalone: false
})
export class SearchDialogComponent implements OnInit {
  @Input('isOpen')
  public isOpen             :any;
  @Output() close = new EventEmitter();

  public showTrailer: boolean = false
  public selectedMovie: any
  public trailerUrl: any
  public myMovies: any
  public submitting: boolean = false
  public loading: boolean = false
  public results: Array<any> = []
  public testBrowser: boolean
  public hoveredItem: string = ''
  public showRank: boolean = true
  public noTrailerMsg: string = ''
  public searchMode: 'title' | 'actor' | 'director' = 'title'
  public searchTerm: string = ''
  
  constructor(public dataService: DataService, 
              public util: UtilService, 
              private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) platformId: string) {
    this.testBrowser = isPlatformBrowser(platformId);
    console.log(this.testBrowser, 'is browser? constructor')
   }

  public closeModal() {
    this.isOpen = false;
    this.selectedMovie = null; 
    this.trailerUrl = null;
    this.showTrailer = false;
    this.close.emit(); 
  }

  ngOnInit(): void {
  }

  public doSearch(e) {
    this.searchTerm = e.target.value;
    this.runSearch(this.searchTerm);
  }

  public setSearchMode(mode: 'title' | 'actor' | 'director') {
    if (this.searchMode === mode) {
      return;
    }

    this.searchMode = mode;
    this.runSearch(this.searchTerm);
  }

  private resetSearchState() {
    this.loading = false;
    this.results = [];
    this.selectedMovie = null;
    this.trailerUrl = null;
    this.showTrailer = false;
  }

  private runSearch(term: string) {
    if (term.length > 2) {
      this.loading = true;
      this.dataService.searchTrending(term, this.searchMode).subscribe(res => {
        this.format(res);
      }, () => {
        this.loading = false;
        this.results = [];
      });
    }

    if (term.length === 0) {
      this.resetSearchState();
    }

    if (term.length > 0 && term.length < 3) {
      this.results = []
      this.loading = false
    }
  }

  public format(data) {
    this.util.relatedInfo(data[0].results, data[0].providers, 'providers', this.dataService.type, '', 0)
    this.util.relatedInfo(data[0].results, data[0].credits, 'credits', this.dataService.type, '', 0)
    this.loading = false
    this.results = data[0].results
  }

  public goTo() {
    document.querySelector("div[id=topanchor]").scrollIntoView();
  }

  public rating(r) {
    r.rating = Array(Math.round(r.vote_average)).fill(0);
    return Array(Math.round(r.vote_average)).fill(0);
  }

  public openTrailer(movie) {
    this.noTrailerMsg = ''
    this.submitting = true
    this.selectedMovie = movie
    this.goTo()
    
      this.dataService.search(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
          }
          this.submitting = false
          this.showTrailer = true
          
        } else {
          this.noTrailerMsg = 'Trailer not available'
          this.submitting = false
          this.showTrailer = false
        }
      })
  }
}
