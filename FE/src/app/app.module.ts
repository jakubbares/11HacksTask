import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {AuthGuard} from './guards/auth.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PitchService} from './services/pitch.service';
import {ChartService} from './services/chart.service';
import {ShotChart} from './charts/shot/shot.chart';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    routes
  ],
  declarations: [
    ShotChart,
    AppComponent,
  ],
  providers: [
    AuthGuard,
    ChartService,
    PitchService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  ],
})
export class AppModule { }
