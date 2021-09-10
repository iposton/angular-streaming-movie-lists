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
  public currentItem: string
  public reminders: any
  public showSnack: boolean = false
  public showRank: boolean = true
  public reminderAlert: string = ""

  constructor( private dataService: DataService,
               private util: UtilService) { }

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

  public addReminder(item) {
    console.log(item, '')
    this.currentItem = (localStorage.getItem('currentItem')!= undefined) ? JSON.parse(localStorage.getItem('currentItem')) : [  ];
    this.reminders = this.currentItem;

    if (this.reminders != null) {
      this.reminders.forEach((reminder, index) => {
        if (reminder.id === item.id) {
          this.showSnack = true;
          this.reminderAlert = "This reminder already exists.";
          setTimeout(()=> {
            this.showSnack = false;
            this.reminderAlert = "";
          }, 2950); 
        }
      });
    }
  
    if (this.reminderAlert === '' && !this.showSnack) {
      this.reminders.push({
        newReminder: item,
        dateAdded: new Date().toISOString().slice(0,10),
        id: item.id
      });

      localStorage.setItem('currentItem', JSON.stringify(this.reminders));

      this.showSnack = true;
      this.reminderAlert = "Reminder Added";
      setTimeout(()=> {
        this.showSnack = false;
        this.reminderAlert = "";
      }, 2950);
    } 
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
    document.querySelector("div[id=top]").scrollIntoView();
  }

  public openTrailer(movie) {
    //console.log('open', movie);
    this.submitting = true;
    this.selected = movie;
    this.goTo();
    if (movie.type === 'movies') {
      this.dataService.search(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.dialogUrl = this.util.sanitize(res['results'][0])
          }
          this.submitting = false;
          this.showTrailer = true;
        }
      })
    } else {
      this.dataService.searchtv(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.dialogUrl = this.util.sanitize(res['results'][0])
          }
          this.submitting = false;
          this.showTrailer = true;
        }
      })
    }
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

  public getData(data, c: string) {
    if (c === 'newReminder') {
      return data;
    } else {
      if (data != null) {
        return data[c]
      }
        
    }
  }

  public getProvider(pro) {
    try {
      if (pro === 'unknown') {
        return ''
      } else if (pro['flatrate'] != null) {
        if (pro.flatrate[0].provider_name === 'Amazon Prime Video') {
          return 'prime'
        } else {
          return pro.flatrate[0].provider_name.toLowerCase()
        } 
      } else if (pro['buy'] != null) {
        return ''
      } else if (pro['rent'] != null) {
        return ''
      } else {
        return ''
      }
    } catch(e) {
      console.log(e, 'error')
    }
  }

  public typeOf(value) {
    return typeof value;
  }

}
