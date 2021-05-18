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
              
            item.details = e;
            item.type = itemType; //'movies';
            item.rating = Array(Math.round(item.vote_average)).fill(0);
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
