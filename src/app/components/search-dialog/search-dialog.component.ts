import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core'
import { DataService } from '../../services/data.service'
import { UtilService } from '../../services/util.service'
import { DomSanitizer } from '@angular/platform-browser'
import { isPlatformBrowser } from '@angular/common'
import { of, Subject, Subscription, timer } from 'rxjs'
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators'

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SearchDialogComponent implements OnInit, OnDestroy {
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
  public hasSearched: boolean = false

  private readonly searchRequests = new Subject<{ term: string, mode: 'title' | 'actor' | 'director' }>()
  private searchSubscription: Subscription
  
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
    this.searchTerm = '';
    this.resetSearchState();
    this.close.emit(); 
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchRequests.pipe(
      map(request => ({
        term: request.term.trim().replace(/\s+/g, ' '),
        mode: request.mode
      })),
      distinctUntilChanged((previous, current) =>
        previous.term === current.term && previous.mode === current.mode
      ),
      switchMap(request => {
        if (request.term.length < 3) {
          return of({ state: 'idle', data: null });
        }

        // Keeping the delay inside switchMap cancels both the timer and any
        // in-flight HTTP request as soon as the user types again.
        return timer(350).pipe(
          tap(() => {
            this.loading = true;
            this.hasSearched = false;
          }),
          switchMap(() => this.dataService.searchTrending(request.term, request.mode)),
          map(data => ({ state: 'success', data })),
          catchError(() => of({ state: 'error', data: null }))
        );
      })
    ).subscribe(result => {
      if (result.state === 'success') {
        this.format(result.data);
        this.hasSearched = true;
        return;
      }

      this.loading = false;
      if (result.state === 'error') {
        this.results = [];
        this.hasSearched = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  public doSearch(e) {
    this.searchTerm = e.target.value;
    this.queueSearch();
  }

  public setSearchMode(mode: 'title' | 'actor' | 'director') {
    if (this.searchMode === mode) {
      return;
    }

    this.searchMode = mode;
    this.queueSearch();
  }

  private resetSearchState() {
    this.loading = false;
    this.results = [];
    this.selectedMovie = null;
    this.trailerUrl = null;
    this.showTrailer = false;
    this.hasSearched = false;
  }

  private queueSearch() {
    this.loading = false;
    if (this.searchTerm.trim().length < 3) {
      this.resetSearchState();
    }

    this.searchRequests.next({ term: this.searchTerm, mode: this.searchMode });
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
