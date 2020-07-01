import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input('data')
  public data               :any;
  @Input('title')
  public title              :any;
  @Input('isOpen')
  public isOpen             :any;
  @Input('type')
  public type               :any;
  @Output() close = new EventEmitter();

  public showTrailer: boolean = false;
  public selectedMovie: any;
  public trailerUrl: any;
  public myMovies: any;
  public hoveredItem: string = '';
  public submitting: boolean = false;

  constructor( private dataService: DataService,
               private sanitizer: DomSanitizer) { }

  public rmv(item, data) {
    //this.remove.emit(item); 
    data.forEach((reminder, index) => {
      if(data[index].id === item.id) {
        data.splice(index, 1);
        localStorage.setItem('currentItem', JSON.stringify(data));
        this.selectedMovie = null; 
        this.trailerUrl = null;
        this.showTrailer = false;
      }
    })
    
  }

  public closeModal() {
    this.isOpen = false;
    this.selectedMovie = null; 
    this.trailerUrl = null;
    this.showTrailer = false;
    this.close.emit(); 
  }

  public goTo() {
    document.querySelector("div[id=top]").scrollIntoView();
  }

  public openTrailer(movie) {
    this.submitting = true;
    this.selectedMovie = movie;
    this.goTo();
    if (movie.type === 'movies') {
      this.dataService.search(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
          }
          this.submitting = false;
          this.showTrailer = true;
        }
      })
    } else {
      this.dataService.searchtv(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
          }
          this.submitting = false;
          this.showTrailer = true;
        }
      })
    }
  }

  ngOnInit(): void {
  }

}
