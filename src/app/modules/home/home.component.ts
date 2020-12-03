import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public netFlix: Array<any>;
  public amazon: Array<any>;
  public disney: Array<any>;
  public netFlixTv: Array<any>;
  public amazonTv: Array<any>;
  public disneyTv: Array<any>;
  public error: any;
  public info: boolean = false;
  public netFlixSlide: Array<any> = [];
  public amzSlide: Array<any> = [];
  public disneySlide: Array<any> = [];
  public netFlixDetails: Array<any> = [];
  public netFlixCredits: Array<any> = [];
  public amazonDetails: Array<any> = [];
  public amazonCredits: Array<any> = [];
  public disneyDetails: Array<any> = [];
  public disneyCredits: Array<any> = [];
  public netFlixTvSlide: Array<any> = [];
  public amzTvSlide: Array<any> = [];
  public disneyTvSlide: Array<any> = [];
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
  public selectedMovie: any;
  public year: string = '20';
  public provider: string = 'npy';
  public genre: string = "";
  public related: Array<any>;
  public relatedDetails: Array<any>;
  public relatedCredits: Array<any>;
  public gTop: boolean = true;
  public gBottom: boolean = false;
  public showSnack: boolean = false;
  public showRank: boolean = true;
  public hoveredItem: string = '';
  public hoverRank: number = 99;
  public currentItem: string;
  public reminders: any;
  public reminderAlert: string = "";
  public testBrowser: boolean;

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private gaService: GoogleAnalyticsService,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.testBrowser = isPlatformBrowser(platformId);
    //this.loadMovies();
  }

  public onChange(cat: string) {
    if (cat === 'tv') {
      if (this.netFlixTv == null)
        this.loadTv();
      else
        this.type = cat;
    } else {
      this.type = cat;
      if (this.netFlix == null) {
        this.loadMovies();
      }
    }
  }

  public onYearChange(year: string) {
    if (this.year != year && this.type === 'movies') {
      this.year = year;
      this.loadMovies();
    } else if (this.year != year && this.type === 'tv') {
      this.year = year;
      this.loadTv();
    }
  }

  public onProviderChange(provider: string) {
    if (this.provider != provider && this.type === 'movies') {
      this.netFlixTv = null
      this.genre = '';
      this.provider = provider;
      this.loadMovies();
    } else if (this.provider != provider && this.type === 'tv') {
      this.netFlix = null;
      this.genre = '';
      this.provider = provider;
      this.loadTv();
    }
  }

  public setGenre(genre: string) {
    if (this.genre != genre && this.type === 'movies') {
      this.genre = genre;
      this.loadMovies();
    } else if (this.genre != genre && this.type === 'tv') {
      this.genre = genre;
      this.loadTv();
    } else if (this.genre == genre && this.type === 'movies') {
      this.genre = '';
      this.loadMovies();
    } else if (this.genre == genre && this.type === 'tv') {
      this.genre = '';
      this.loadTv();
    }
  }

  public addReminder(item) {
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

  public loadMovies() {
    this.submitting = true;
    this.type = 'movies';
    this.dataService.getData(this.year, this.genre, this.provider).subscribe(res => {
      //console.log(res, 'movies from server');
      this.netFlix = res[0].nfMovies;
      this.amazon = res[0].amzMovies;
      this.disney = res[0].disneyMovies;
      this.netFlixCredits = res[0].nfCredits;
      this.netFlixDetails = res[0].nfDetails;
      this.amazonCredits = res[0].amzCredits;
      this.amazonDetails = res[0].amzDetails;
      this.disneyCredits = res[0].disneyCredits;
      this.disneyDetails = res[0].disneyDetails;
      this.rank(this.netFlix);
      this.rank(this.amazon);
      this.rank(this.disney);
      this.netFlixSlide = this.createSlideArr(this.netFlix);
      this.amzSlide = this.createSlideArr(this.amazon);
      this.disneySlide = this.createSlideArr(this.disney);
      this.sortData();
    });
  }

  public loadTv() {
    this.submitting = true;
    this.type = 'tv';
    this.dataService.getTv(this.year, this.genre, this.provider).subscribe(res => {
      //console.log(res, 'tv from server');
      this.netFlixTv = res[0].nfTv;
      this.amazonTv = res[0].amzTv;
      this.disneyTv = res[0].disneyTv;
      this.netFlixTvCredits = res[0].nfTvCredits;
      this.netFlixTvDetails = res[0].nfTvDetails;
      this.amazonTvCredits = res[0].amzTvCredits;
      this.amazonTvDetails = res[0].amzTvDetails;
      this.disneyTvCredits = res[0].disneyTvCredits;
      this.disneyTvDetails = res[0].disneyTvDetails;
      this.rank(this.netFlixTv);
      this.rank(this.amazonTv);
      this.rank(this.disneyTv);
      this.netFlixTvSlide = this.createSlideArr(this.netFlixTv);
      this.amzTvSlide = this.createSlideArr(this.amazonTv);
      this.disneyTvSlide = this.createSlideArr(this.disneyTv);
      this.sortTv();
    });
  }

  public rank(array) {
    array.forEach((item, index) => {
      item.rank = index + 1;
    });
  }

  public createSlideArr(array) {
    let arr = array;
    let n = 5;
    return arr.reduce(
      (r, e, i) => (i % n ? r[r.length - 1].push(e) : r.push([e])) && r,
      []
    );
  }

  public sortData() {
    try {
      for (let movie of this.netFlix) {
        for (let details of this.netFlixDetails) {
          if (movie.id === details.id) {
            movie.details = details;
            movie.type = 'movies';
            movie.rating = Array(Math.round(movie.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let movie of this.netFlix) {
      for (let credits of this.netFlixCredits) {
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.credits = credits;
          movie.type = 'movies';
          if (credits.cast[0] != null) {
            movie.credit1 = credits.cast[0]['name'];
            movie.credit1Pic = credits.cast[0]['profile_path'];
            movie.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
            movie.credit2Pic = credits.cast[1]['profile_path'];
            movie.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }

    try {
      for (let movie of this.amazon) {
        for (let details of this.amazonDetails) {
          if (movie.id === details.id) {
            movie.type = 'movies';
            movie.details = details;
            movie.rating = Array(Math.round(movie.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let movie of this.amazon) {
      for (let credits of this.amazonCredits) {
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.type = 'movies';
          movie.credits = credits;
          if (credits.cast[0] != null) {
            movie.credit1 = credits.cast[0]['name'];
            movie.credit1Pic = credits.cast[0]['profile_path'];
            movie.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
            movie.credit2Pic = credits.cast[1]['profile_path'];
            movie.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }

    try {
      for (let movie of this.disney) {
        for (let details of this.disneyDetails) {
          if (movie.id === details.id) {
            movie.type = 'movies';
            movie.details = details;
            movie.rating = Array(Math.round(movie.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let movie of this.disney) {
      for (let credits of this.disneyCredits) {
        //console.log(credits, 'credits')
        if (movie.id === credits.id) {
          movie.type = 'movies';
          movie.credits = credits;
          if (credits.cast[0] != null) {
            movie.credit1 = credits.cast[0]['name'];
            movie.credit1Pic = credits.cast[0]['profile_path'];
            movie.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            movie.credit2 = credits.cast[1]['name'];
            movie.credit2Pic = credits.cast[1]['profile_path'];
            movie.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }
    this.submitting = false;
  }

  public sortTv() {
    try {
      for (let tv of this.netFlixTv) {
        for (let details of this.netFlixTvDetails) {
          if (tv.id === details.id) {
            tv.type = 'tv';
            tv.details = details;
            tv.rating = Array(Math.round(tv.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let tv of this.netFlixTv) {
      for (let credits of this.netFlixTvCredits) {
        //console.log(credits, 'credits')
        if (tv.id === credits.id) {
          tv.type = 'tv';
          tv.credits = credits;
          if (credits.cast[0] != null) {
            tv.credit1 = credits.cast[0]['name'];
            tv.credit1Pic = credits.cast[0]['profile_path'];
            tv.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            tv.credit2 = credits.cast[1]['name'];
            tv.credit2Pic = credits.cast[1]['profile_path'];
            tv.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }

    try {
      for (let tv of this.amazonTv) {
        for (let details of this.amazonTvDetails) {
          if (tv.id === details.id) {
            tv.type = 'tv';
            tv.details = details;
            tv.rating = Array(Math.round(tv.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let tv of this.amazonTv) {
      for (let credits of this.amazonTvCredits) {
        //console.log(credits, 'credits')
        if (tv.id === credits.id) {
          tv.type = 'tv';
          tv.credits = credits;
          if (credits.cast[0] != null) {
            tv.credit1 = credits.cast[0]['name'];
            tv.credit1Pic = credits.cast[0]['profile_path'];
            tv.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            tv.credit2 = credits.cast[1]['name'];
            tv.credit2Pic = credits.cast[1]['profile_path'];
            tv.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }

    try {
      for (let tv of this.disneyTv) {
        for (let details of this.disneyTvDetails) {
          if (tv.id === details.id) {
            tv.type = 'tv';
            tv.details = details;
            tv.rating = Array(Math.round(tv.vote_average)).fill(0);
          }
        }
      }
    } catch (e) {
      console.log(e, 'error');
    }

    for (let tv of this.disneyTv) {
      for (let credits of this.disneyTvCredits) {
        //console.log(credits, 'credits')
        if (tv.id === credits.id) {
          tv.type = 'tv';
          tv.credits = credits;
          if (credits.cast[0] != null) {
            tv.credit1 = credits.cast[0]['name'];
            tv.credit1Pic = credits.cast[0]['profile_path'];
            tv.credit1Char = credits.cast[0]['character'];
          }
          if (credits.cast[1] != null) {
            tv.credit2 = credits.cast[1]['name'];
            tv.credit2Pic = credits.cast[1]['profile_path'];
            tv.credit2Char = credits.cast[1]['character'];
          }
        }
      }
    }
    this.submitting = false;
  }

  ngOnInit(): void {
    if (this.testBrowser) {
      this.loadMovies();
      try {
        if (window.innerWidth <= 500) {
          this.isMobile = true;
        } else {
          //console.log('isMobile?', this.isMobile);
        }
      } catch (e) {
        console.log(e, 'window error');
      }
    }
  }

  public getSelectedMovies() {
    if (this.myMovies === 'nf') {
      // this.gaService.eventEmitter("netflix", "popular", "movies", "click", 10);
      this.title = this.provider === 'npy' ? 'netflix' : this.provider === 'hha' ? 'hbo' : 'netflix kids';
      if (this.isMobile) {
        if (this.type === 'movies') {
          return this.netFlix;
        } else {
          return this.netFlixTv;
        } 
      } else {
        if (this.type === 'movies') {
          return this.netFlixSlide;
        } else {
          return this.netFlixTvSlide;
        }  
      }
    }
    if (this.myMovies === 'amz') {
      // this.gaService.eventEmitter("primevideo", "popular", "movies", "click", 10);
      this.title = this.provider === 'npy' ? 'amazon prime' : this.provider === 'hha' ? 'hulu' : 'disney +';
      if (this.isMobile) {
        if (this.type === 'movies') {
          return this.amazon;
        } else {
          return this.amazonTv;
        } 
      } else {
        if (this.type === 'movies') {
          return this.amzSlide;
        } else {
          return this.amzTvSlide;
        } 
      }
    }
    if (this.myMovies === 'd') {
      // this.gaService.eventEmitter("disney", "popular", "movies", "click", 10);
      this.title = this.provider === 'npy' ? 'youtube tv' : this.provider === 'hha' ? 'apple tv' : 'pbs kids';
      if (this.isMobile) {
        if (this.type === 'movies') {
          return this.disney;
        } else {
          return this.disneyTv;
        } 
      } else {
        if (this.type === 'movies') {
          return this.disneySlide;
        } else {
          return this.disneyTvSlide;
        } 
      }
    }
  }

  public goTo() {
    document.querySelector("div[id=top]").scrollIntoView();
  }

  public openTrailer(movie, cat) {
    this.isOpen = false;
    this.selectedMovie = movie;
    this.goTo();
    if (cat === 'movies') {
      this.dataService.search(movie.id).subscribe(res => {
        console.log(res, 'trailer res')
        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
          }
         
        if (res['related'][0] != null) {
            // let element = document.getElementById('top');    
            // element.scrollIntoView(true);
            this.related = res['related'];
            this.relatedDetails = res['details'];
            this.relatedCredits = res['credits'];
            
            for (let rel of this.related) {
              for (let details of this.relatedDetails) {
                if (rel != null && rel.id === details.id) {
                  rel.details = details;
                  rel.rating = Array(Math.round(rel.vote_average)).fill(0);
                }
              }
            }

            for (let rel of this.related) {
              for (let credits of this.relatedCredits) {
                //console.log(credits, 'credits')
                if (rel.id === credits.id) {
                  rel.credits = credits;
                  if (credits.cast[0] != null) {
                    rel.credit1 = credits.cast[0]['name'];
                    rel.credit1Pic = credits.cast[0]['profile_path'];
                    rel.credit1Char = credits.cast[0]['character'];
                  }
                  if (credits.cast[1] != null) {
                    rel.credit2 = credits.cast[1]['name'];
                    rel.credit2Pic = credits.cast[1]['profile_path'];
                    rel.credit2Char = credits.cast[1]['character'];
                  }
                }
              }
            }
          }
          this.isOpen = true;
        }
      });
    } else {
      this.dataService.searchtv(movie.id).subscribe(res => {

        if (res['results'][0] != null) {
          if (res['results'][0].site === 'YouTube') {
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${res['results'][0].key}`
            );
           
            this.related = res['related'];
            this.relatedDetails = res['details'];
            this.relatedCredits = res['credits'];
            
            for (let rel of this.related) {
              for (let details of this.relatedDetails) {
                if (rel.id === details.id) {
                  rel.details = details;
                  rel.rating = Array(Math.round(rel.vote_average)).fill(0);
                }
              }
            }

            for (let rel of this.related) {
              for (let credits of this.relatedCredits) {
                //console.log(credits, 'credits')
                if (rel.id === credits.id) {
                  rel.credits = credits;
                  if (credits.cast[0] != null) {
                    rel.credit1 = credits.cast[0]['name'];
                    rel.credit1Pic = credits.cast[0]['profile_path'];
                    rel.credit1Char = credits.cast[0]['character'];
                  }
                  if (credits.cast[1] != null) {
                    rel.credit2 = credits.cast[1]['name'];
                    rel.credit2Pic = credits.cast[1]['profile_path'];
                    rel.credit2Char = credits.cast[1]['character'];
                  }
                }
              }
            }
            this.isOpen = true;
          }
        }
      });
    }
    
  }
}
