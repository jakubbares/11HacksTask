import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {AuthGuard} from './guards/auth.guard';
import {AuthenticationService} from './services/authentication.service';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {UserComponent} from './pages/user/user.component';
import {PlayerComponent} from './pages/player/player.component';
import {LeagueComponent} from './pages/league/league.component';
import {MatchComponent} from './pages/match/match.component';
import {MatchService} from './services/match.service';
import {LeagueService} from './services/league.service';
import {TeamService} from './services/team.service';
import {PlayerService} from './services/player.service';
import {TeamComponent} from './pages/team/team.component';

import {RadarChart} from './charts/radar/radar.chart';
import {ComparisonComponent} from './pages/comparison/comparison.component';
import {SearchComponent} from './pages/search/search.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {NotesComponent} from './components/notes/notes.component';
import {AutoCompleteModule, MessagesModule} from 'primeng/primeng';
import {PlayerSortPipe, SortMulStringPipe, SortPipe, SortStringPipe} from './pipes/sort.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import {DistributionChart} from './charts/distribution.chart';
import {PieChart} from './charts/pie.chart';
import {BarChart} from './charts/bar.chart';
import {PitchService} from './services/pitch.service';
import {ChancesChart} from './charts/chances/chances.chart';
import {TagsService} from './services/tags.service';
import {ScoutingService} from './services/scouting.service';
import {NewTaskModal} from './modal/newtask.modal';
import {ChartService} from './services/chart.service';
import {SimilarService} from './services/similar.service';
import {SharedModule} from './shared.module';
import {DateSliderComponent} from './components/slider/date-slider.component';
import {YearRangeSliderComponent} from './components/slider/year-range-slider.component';
import {RangeSliderComponent} from './components/slider/range-slider.component';
import {Visualization} from './components/visualizations/visualization';
import {LineChart} from './charts/line.chart';
import {MultilineChart} from './charts/multiline.chart';
import {PassingZonesChart} from './charts/passing-zones/passing-zones.chart';
import {ShotChart} from './charts/shot/shot.chart';
import {DefenseChart} from './charts/defense/defense.chart';
import {PassingClustersChart} from './charts/passing-clusters/passing-clusters.chart';
import {Ng5SliderModule} from './components/ng5-slider/slider.module';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {HttpClientModule} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {MovementChart} from './charts/movement/movement.chart';
import {PassingCentersHorizontalChart} from './charts/passing-centers/passing-centers-horizontal.chart';
import {ScatterChart} from './charts/scatterplot/scatter.chart';
import {TrendlineChart} from './charts/trendline/trendline.chart';
import {TableComponent} from './pages/table/table.component';
import {FakeService} from './services/fake.service';
import {SpiderChart} from './charts/spider/spider.chart';
import {PassesSonarChart} from './charts/passes-sonar/passes-sonar.chart';
import {AllClustersChart} from './charts/passing-clusters/all-clusters.chart';
import {HeatmapChart} from './charts/heatmap/heatmap.chart';
import {CalendarModule} from 'primeng/calendar';
import {NewUserComponent} from './pages/new-user/new-user.component';
import {DivEnterComponent} from './components/helpers/div-enter/div-enter.component';
import {SwitchDivComponent} from './components/helpers/switch-div/switch-div.component';
import {PlayerLegendComponent} from './components/helpers/player-legend/player-legend.component';
import {PrintNamesComponent} from './components/helpers/print/print-names.component';
import {PrintHeaderComponent} from './components/helpers/print/print-header.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
import {TranslationService} from "./services/translation.service";
import {Store} from "./services/store";
import {MatchSelectorModal} from "./modal/match-selector/match-selector.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PassingMapChart} from "./charts/passing-map/passing-map.chart";
import {GridFieldComponent} from "./charts/passing-map/grid-field.component";
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CheckboxModule} from 'primeng/checkbox';
import {SavedFiltersModal} from "./modal/saved-filters/saved-filters.component";
import {SavedFilterComponent} from "./modal/saved-filters/saved-filter.component";
import {RoundSelectorModal} from "./modal/round-selector/round-selector.component";
import {ChartExporterComponent} from "./components/chart-exporter/chart-exporter.component";
import {ExportImageService} from "./services/export-image.service";
import {PrintFrameComponent} from "./components/helpers/print-frame/print-frame.component";
import {TouchesChart} from "./charts/touches/touches.chart";
import {PassingCentersChart} from "./charts/passing-centers/passing-centers.chart";
import {ExpectedRealChart} from "./charts/expected-real/expected-real.chart";
import {PassesChart} from "./charts/passes/passes.chart";
import {PassingPresenceChart} from "./charts/passing-presence/passing-presence.chart";
import {SmallFieldComponent} from "./charts/passing-presence/small-field.component";
import {FieldHeaderComponent} from "./charts/passing-presence/field-header.component";
import {XgDevelopmentChart} from "./charts/xg-development/xg-development.chart";
import {HeatmapPassesChart} from "./charts/heatmap-passes/heatmap-passes.chart";
import {SquadComparisonChart} from "./charts/squad-comparison/squad-comparison.chart";
import {LoadingComponent} from "./components/loading/loading.component";
import {ErrorsComponent} from "./components/errors/errors.component";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  imports: [
    Ng5SliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    SharedModule,
    BrowserModule,
    CalendarModule,
    BrowserAnimationsModule,
    FormsModule,
    MessagesModule,
    HttpClientModule,
    MultiSelectModule,
    DropdownModule,
    ToastModule,
    TableModule,
    AutoCompleteModule,
    ToggleButtonModule,
    CheckboxModule,
    ButtonModule,
    routes
  ],
  declarations: [
    Visualization,
    DateSliderComponent,
    YearRangeSliderComponent,
    RangeSliderComponent,
    TableComponent,
    NewTaskModal,
    NotesComponent,
    ErrorsComponent,
    PassingCentersHorizontalChart,
    PassingCentersChart,
    PassingZonesChart,
    MovementChart,
    ScatterChart,
    HeatmapChart,
    ExpectedRealChart,
    PassingClustersChart,
    PassingMapChart,
    AllClustersChart,
    DefenseChart,
    TouchesChart,
    ShotChart,
    PieChart,
    SmallFieldComponent,
    GridFieldComponent,
    SwitchDivComponent,
    PlayerLegendComponent,
    FieldHeaderComponent,
    PrintNamesComponent,
    PrintFrameComponent,
    PrintHeaderComponent,
    MatchSelectorModal,
    RoundSelectorModal,
    SavedFiltersModal,
    SavedFilterComponent,
    ChancesChart,
    PassingPresenceChart,
    HeatmapPassesChart,
    XgDevelopmentChart,
    SquadComparisonChart,
    BarChart,
    PassesChart,
    LineChart,
    TrendlineChart,
    MultilineChart,
    DivEnterComponent,
    SpiderChart,
    PassesSonarChart,
    RadarChart,
    ChartExporterComponent,
    NewUserComponent,
    SpinnerComponent,
    DistributionChart,
    ComparisonComponent,
    SearchComponent,
    AppComponent,
    UserComponent,
    MatchComponent,
    TeamComponent,
    PlayerComponent,
    LeagueComponent,
    LoginComponent,
    RegisterComponent,
    LoadingComponent,
    FilterPipe,
    PlayerSortPipe,
    SortStringPipe,
    SortMulStringPipe,
    SortPipe
  ],
  providers: [
    Store,
    AuthGuard,
    ChartService,
    TranslationService,
    AuthenticationService,
    MatchService,
    LeagueService,
    TeamService,
    TagsService,
    ScoutingService,
    PlayerService,
    ExportImageService,
    PitchService,
    SimilarService,
    MessageService,
    FakeService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    MatchSelectorModal,
    RoundSelectorModal,
    SavedFiltersModal
  ],
})
export class AppModule { }
