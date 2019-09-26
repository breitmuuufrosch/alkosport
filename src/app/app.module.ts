import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AngularMaterialModule} from './angular-material.module';
import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faGlassCheers, faUser, faUsers, faRunning} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from './app.component';
import {CustomDateAdapter} from './services/custom-date-adapter';
import {EnterCurrentDayComponent} from './enter-current-day/enter-current-day.component';
import {StatisticsSingleComponent} from './statistics-single/statistics-single.component';
import {StatisticsAllComponent} from './statistics-all/statistics-all.component';
import {VsCounterComponent} from './vs-counter/vs-counter.component';
import {CookieService} from 'ngx-cookie-service';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    EnterCurrentDayComponent,
    StatisticsSingleComponent,
    StatisticsAllComponent,
    VsCounterComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DATE_LOCALE, useValue: 'de-CH'},
    { provide: DateAdapter, useClass: CustomDateAdapter },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faGlassCheers, faUser, faUsers, faRunning);
  }
}
