import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UtilService } from '../../services/util.service';

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
  @Input('content')
  public content            :any;
  @Input('selected')
  public selected           :any;
  @Input('selectedMovie')
  public selectedMovie      :any;
  @Input('selectedTV')
  public selectedTV         :any;
  @Input('trailerUrl')
  public trailerUrl         :any;
  @Input('dialogUrl')
  public dialogUrl         :any;
  @Input('trailerUrlTV')
  public trailerUrlTV       :any;
  @Input('showTrailer')
  public showTrailer        :any;
  @Input('showTitles')
  public showTitles         :any;
  @Input('isOpen')
  public isOpen             :any;
  @Input('loading')
  public loading            :any;
  @Input('loadingTitle')
  public loadingTitle       :any;
  @Input('type')
  public type               :any;
  @Output() close = new EventEmitter();

  public myMovies: any
  public hoveredItem: string = ''
  public submitting: boolean = false
  public showRank: boolean = true
  public noTrailerMsg: string = ''
  public currentDate: any;

  constructor( private dataService: DataService,
               public util: UtilService) {
    let today = new Date()
    this.currentDate = today.toLocaleDateString("en-US")
  }

  public rmv(item, data) {
    //this.remove.emit(item); 
    data.forEach((reminder, index) => {
      if(data[index].id === item.id) {
        data.splice(index, 1);
        localStorage.setItem('currentItem', JSON.stringify(data));
        this.selected = null; 
        this.dialogUrl = null;
        this.showTrailer = false;
      }
    })  
  }

  public rmvFav(item, data) {
    data.forEach((reminder, index) => {
      if(data[index].id === item.id) {
        data.splice(index, 1);
        //data.length = 5
        localStorage.setItem('favorites', JSON.stringify(data));
      }
    })  
  }

  public closeModal() {
    this.isOpen = false;
    this.selected = null;
    this.selectedTV = null;
    this.selectedMovie = null; 
    this.trailerUrl = null;
    this.trailerUrlTV = null;
    this.dialogUrl = null;
    this.showTrailer = false;
    this.showTitles = '';
    this.close.emit(); 
  }

  public goTo() {
    document.querySelector("div[id=topanchor]").scrollIntoView();
  }

  public openTrailer(movie) {
    this.noTrailerMsg = ''
    this.dataService.type = (movie.media_type || movie.type)  === 'tv' ? 'tv' : 'movie'
    console.log('open', movie);
    this.submitting = true;
    this.selected = movie;
    this.goTo()

    this.dataService.search(movie.id).subscribe(res => {
      if (this.title === 'Recommended') 
        this.data = this.util.recommend(res['related'], res['providers'], res['details'], res['credits'])

        //console.log(res['results'], 'trailer results')

      if (res['results'][0] != null) {
        if (res['results'][0].site === 'YouTube') {
          this.dialogUrl = this.util.sanitize(res['results'][0])
        }
        
        this.submitting = false
        this.showTrailer = true
      } else {
        this.submitting = false
        this.noTrailerMsg = 'Trailer not available'
        this.showTrailer = false
      }

    })
  }

  ngOnInit(): void {
  }

  public filterTitles(titles) {
    if(titles === this.showTitles) {
      this.showTitles = '';
    } else {
      this.showTitles = titles;
    }
  }

  public getData(data, c: string, title: string) {
    // console.log(data, 'data', c, 'content')
    if (c === 'newReminder' || title === 'Recommended' || c === 'favorite') {
      return data
    } else {
      if (data != null) {
      return data[c]
      }    
    }
  }

  public typeOf(value) {
    return typeof value;
  }
}
