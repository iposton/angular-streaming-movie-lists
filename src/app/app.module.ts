import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
//import {TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { SliderComponent } from './components/slider/slider.component';
import { WindowRefService } from './services/window-ref.service';
//import { TransferHttpInterceptorService } from './services/transfer-http-interceptor.service';
//import { TransferStateInterceptor } from './interceptors/transfer-state.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GoogleAnalyticsGtagComponent } from './components/google-analytics-gtag/google-analytics-gtag.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent,
    GoogleAnalyticsGtagComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
     WindowRefService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TransferStateInterceptor,
    //   multi: true
    // }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
