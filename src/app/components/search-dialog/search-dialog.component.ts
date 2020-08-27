import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  @Input('isOpen')
  public isOpen             :any;
  @Output() close = new EventEmitter();

  public showTrailer: boolean = false;
  public selectedMovie: any;
  public trailerUrl: any;
  public myMovies: any;
  public submitting: boolean = false;
  public loading: boolean = false;
  public results: Observable<any>;
  public searchField: FormControl;

  constructor(private dataService: DataService, private sanitizer: DomSanitizer) { }

  public closeModal() {
    this.isOpen = false;
    this.selectedMovie = null; 
    this.trailerUrl = null;
    this.showTrailer = false;
    this.searchField.setValue('');
    this.close.emit(); 
  }

  ngOnInit(): void {
    this.searchField = new FormControl();
    this.results = this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(_ => { 
        this.loading = true; 
      }),
      switchMap(term => this.dataService.searchTrending(term)),
      tap(_ => (this.loading = false))
    );
  }

  doSearch(term: string) {
    this.dataService.searchTrending(term);
  }

  public goTo() {
    document.querySelector("div[id=top]").scrollIntoView();
  }

  public rating(r) {
    r.rating = Array(Math.round(r.vote_average)).fill(0);
    return Array(Math.round(r.vote_average)).fill(0);
  }

  public openTrailer(movie) {
    this.submitting = true;
    this.selectedMovie = movie;
    this.goTo();
      this.dataService.search(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
          }
          this.submitting = false;
          this.showTrailer = true;
        } else {
          this.submitting = false;
        }
      })
  }

}
