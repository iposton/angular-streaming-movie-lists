import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { SliderComponent } from './components/slider/slider.component';
import { WindowRefService } from './services/window-ref.service';
//import { TransferHttpInterceptorService } from './services/transfer-http-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    BrowserTransferStateModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    WindowRefService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
