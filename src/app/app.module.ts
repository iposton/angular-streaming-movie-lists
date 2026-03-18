import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SliderComponent } from './components/slider/slider.component';
import { TransferStateInterceptor } from './interceptors/transfer-state.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GoogleAnalyticsGtagComponent } from './components/google-analytics-gtag/google-analytics-gtag.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SliderComponent,
    GoogleAnalyticsGtagComponent,
    DialogComponent,
    SpinnerComponent,
    SearchDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TransferStateInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
