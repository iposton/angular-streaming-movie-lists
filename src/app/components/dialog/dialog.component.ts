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
        localStorage.setItem('movFavorites', JSON.stringify(data));
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
    this.dataService.isDoubleSearch = false
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

  public copy(data, type, da) {
    let myString = null
    console.log(data, 'data')
    if (type === 'all') {
      myString = data.map(d => (d.newReminder.original_title != null ? d.newReminder.original_title : d.newReminder.name)+' Rating: '+(d.newReminder.rating != null && d.newReminder.rating.constructor === Array ? d.newReminder.rating.length+'/10 ' : ' ')+(d.newReminder.provider != null && this.typeOf(d.newReminder.provider) == 'object' ? this.util.getProvider(d.newReminder.provider).toUpperCase() : d.newReminder.provider != null ? d.newReminder.provider.toUpperCase() : 'unknown')+' '+(d.newReminder.type === 'movies' ? 'Movie' : 'TV Series')+' Added: '+d.dateAdded).join(', ')
      console.log(myString, 'copy this')
      
    } else {
      myString = (data.original_title != null ? data.original_title : data.name)+' Rating: '+(data.rating != null && data.rating.constructor === Array ? data.rating.length+'/10 ' : ' ')+(data.provider != null && this.typeOf(data.provider) == 'object' ? this.util.getProvider(data.provider).toUpperCase() : data.provider != null ? data.provider.toUpperCase() : 'unknown')+' '+(data.type === 'movies' ? 'Movie' : 'TV Series')+' Added: '+da
      console.log(myString, 'copy this')
    }

    this.util.buildTextArea(myString)

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
    //console.log(data, 'data', c, 'content')
    if (c === 'newReminder' || title === 'Recommended' || c === 'favorite') {
      return data
    } else {
      if (Object.keys(data).length > 0) {
        return data[c]
      } else {
        console.log('whats wrong with the data', data)
        //return data
      }   
    }
  }

  public typeOf(value) {
    return typeof value;
  }
}
