import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private sanitizer: DomSanitizer) { }

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
          }

          if (type === 'details') {
           
            if (provider != '' && order > 0) {
              if (provider === 'npy') {
                item.provider = order === 1 ? 'netflix' : order === 2 ? 'prime' : 'youtube';
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

 public sanitize(item) {
   let key = null;
   key = item.key
   return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`);
 }
}
