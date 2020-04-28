import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {TransferState, makeStateKey, StateKey} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class TransferHttpInterceptorService {
  public apiKey: string = '';

  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: any) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const key: StateKey<string> = makeStateKey<string>(request.url);

    if (isPlatformServer(this.platformId)) {
      return next.handle(request).pipe(tap((event) => {
        this.transferState.set(key, (<HttpResponse<any>>event).body); 
      }));
    } else {
      const storedResponse = this.transferState.get<any>(key, null);
      if (storedResponse) {
        const response = new HttpResponse({body: storedResponse, status: 200});
        this.transferState.remove(key);
        return of(response);
      } else {
        //console.log('no stored response', this.transferState);
        return next.handle(request);
      }
    }
  }
}
