import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public genres: any
  public currentItem: string
  public reminders: any
  public showSnack: boolean = false
  public reminderAlert: string = ''
  public loadingMore: boolean
  public isMobile: boolean

  constructor(private sanitizer: DomSanitizer) {
    this.isMobile = false
    this.loadingMore = false
    this.genres =  
    {
      16: 'Animation',
      10751: 'Family',
      35: 'Comedy',
      14: 'Fantasy',
      28: 'Action',
      18: 'Drama',
      10749: 'Romance',
      99: 'Documentary',
      27: 'Horror',
      80: 'Crime',
      10402: 'Music',
      878: 'Sci-Fi',
      37: 'Western',
      53: 'Thriller',
      36: 'History',
      10752: 'War',
      12: 'Adventure'
    }
   }

   public buildTextArea(ms:string) {
      const myTextArea = document.createElement('textarea')
      myTextArea.style.position = 'fixed'
      myTextArea.style.left = '0'
      myTextArea.style.top = '0'
      myTextArea.style.opacity = '0'
      myTextArea.value = `REMINDER TO WATCH: ${ms}`
      document.body.appendChild(myTextArea)
      myTextArea.focus()
      myTextArea.select()
      document.execCommand('copy')
      document.body.removeChild(myTextArea)
      this.snack('Copied To Clipboard.')
   }

   public snack(message:string) {
     this.showSnack = true
     this.reminderAlert = message
     setTimeout(()=> {
       this.showSnack = false
       this.reminderAlert = ""
     }, 2950)
     return
   }

   public addItem(item, type) {
    let name = ''
    if (type === "rem") {
      this.currentItem = (localStorage.getItem('currentItem')!= undefined) ? JSON.parse(localStorage.getItem('currentItem')) : []
      this.reminders = this.currentItem
      name = "reminder"
    } else {
      this.currentItem = (localStorage.getItem('movFavorites')!= undefined) ? JSON.parse(localStorage.getItem('movFavorites')) : []
      this.reminders = this.currentItem
      name = "favorite"
    }
    
  

    if (this.reminders != null) {
      console.log(this.reminders, 'reminders')
      if (type === "fav" && this.reminders.length === 5) {
        this.showSnack = true
        this.reminderAlert = "Max of 5 Favorites."
        setTimeout(()=> {
          this.showSnack = false
          this.reminderAlert = ""
        }, 2950)
        return
      }

      this.reminders.forEach((reminder, index) => {
        if (reminder.id === item.id) {
          this.showSnack = true
          this.reminderAlert = `This ${name} already exists.`;
          setTimeout(()=> {
            this.showSnack = false
            this.reminderAlert = ""
          }, 2950)
          return
        }
           
      });
    }
  
    if (this.reminderAlert === "" && !this.showSnack) {

      if (type === "rem") {
        this.reminders.push({
          newReminder: item,
          dateAdded: new Date().toISOString().slice(0,10),
          id: item.id
        })

        localStorage.setItem('currentItem', JSON.stringify(this.reminders))
      } else {
        this.reminders.push({
          favorite: item,
          dateAdded: new Date().toISOString().slice(0,10),
          id: item.id
        })
        //this.reminders.length = 5
        localStorage.setItem('movFavorites', JSON.stringify(this.reminders))
      }
        

      this.showSnack = true;
      this.reminderAlert = type === 'fav' ? "Favorite Added" : "Reminder Added"
      setTimeout(()=> {
        this.showSnack = false
        this.reminderAlert = ""
      }, 2950);

    } 
  }

  public relatedInfo(items, extras, type: string, itemType: string, provider: string, order: number) {
    for (let item of items) {
      for (let e of extras) {
       
        if (item.id === e.id) {     
          
          if (type === 'credits') {
            item.credits = e;
            item.type = itemType;
            if (e.cast[0] != null) {
              item.credit1 = e.cast[0]['name'];
              item.credit1Pic = e.cast[0]['profile_path'];
              item.credit1Char = e.cast[0]['character'];
            }
            if (e.cast[1] != null) {
              item.credit2 = e.cast[1]['name'];
              item.credit2Pic = e.cast[1]['profile_path'];
              item.credit2Char = e.cast[1]['character'];
            }

            if(e.crew != null) {
              e.crew.forEach((c, index) => {
                if(c.job != null && c.job == "Director") {
                  item.director = c.name
                } else if (itemType === 'tv' && c.job != null && c.job == "Executive Producer" && c.known_for_department == "Directing") {
                  item.director = c.name
                }
              })
            }
            
          }

          if (type === 'details') {
           
            if (provider != '' && order > 0) {
              if (provider === 'npy') {
                item.provider = order === 1 ? 'netflix' : order === 2 ? 'prime' : 'disney';
              } else if (provider === 'hha') {
                item.provider = order === 1 ? 'hbo' : order === 2 ? 'hulu' : 'apple';
              } else if (provider === 'nkpkd') {
                item.provider = order === 1 ? 'netflix' : order === 2 ? 'disney' : 'pbs';
              }
            }
              
            item.details = e
            item.type = itemType
            item['media_type'] = itemType
            item.rating = Array(Math.round(item.vote_average)).fill(0)
          }

          if (type === 'providers') {
            //if (e['results'].US != null)
              //console.log(e['results'].US, 'providers')
            item.provider = e['results'].US != null ? e['results'].US : 'unknown';
          }   
         
        }
      }
    }
    return items;
  }

  public recommend(rec, providers, recDetails, recCreds) {
    for (let rel of rec) {
      for (let pro of providers) {
        if (rel != null && rel.id === pro.id) {
          rel.provider = pro['results'].US != null ? pro['results'].US : 'unknown';
        }
      }
    }
    
    for (let rel of rec) {
      for (let details of recDetails) {
        if (rel != null && rel.id === details.id) {
          rel.details = details;
          rel.rating = Array(Math.round(rel.vote_average)).fill(0);
        }
      }
    }

    for (let rel of rec) {
      for (let credits of recCreds) {
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
     return rec
  }

 public getFlatRate(items) {
    for (let item of items) {
      if (item.provider != null && 
        item.provider != 'unknown' && 
        item.provider['flatrate'] != null) {
        return item;
      }
    }
 }

 public getProvider(pro) {
  try {
    if (pro === 'unknown' || pro == undefined) {
      return ''
    } else if (pro['flatrate'] != null) {
      if (pro.flatrate[0].provider_name === 'Amazon Prime Video') {
        return 'prime'
      } else if (pro.flatrate[0].provider_name.toUpperCase() === 'IMDB TV AMAZON CHANNEL') {
        return 'imdb tv'
      } else if (pro.flatrate[0].provider_name.toUpperCase() === 'APPLE TV PLUS') {
        return 'apple tv'
      } else if (pro.flatrate[0].provider_name.toUpperCase() === 'STARZ PLAY AMAZON CHANNEL') {
        return 'starz'  
      } else if (pro.flatrate[0].provider_name.toUpperCase() === 'SPECTRUM ON DEMAND') {
        return 'spectrum'
      } else if (pro.flatrate[0].provider_name.toUpperCase() === 'PEACOCK PREMIUM') {
        return 'peacock'
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

 public sanitize(item) {
   let key = null;
   key = item.key
   return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
 }
}
