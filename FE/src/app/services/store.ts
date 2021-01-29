import {Injectable} from "@angular/core";
import {LeagueService} from "./league.service";
import {
  capitalizeField,
  distinct, step
} from "../functions/shared.functions";
import {
  League,
  Season,
  Tier,
  LeagueData,
  Position,
  Filter,
  Data,
  Match,
  MatchRound,
  SavedFilter
} from "../models/models";
import {ScoutingService} from "./scouting.service";
import {Subject} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {generateSeasonsMultiple} from "../functions/date.functions";
import {transformData} from "../functions/data.functions";
import {sortEqualsValueTop} from "../functions/sort.functions";
import {sqlInstat} from "../dictionaries/sql.instat";
import {sqlWyscout} from "../dictionaries/sql.wyscout";
import {instatMetricsByGroupMap} from "app/dictionaries/metrics.groups.instat";
import {wyscoutMetricsByGroupMap} from "app/dictionaries/metrics.groups.wyscout";

@Injectable()
export class Store {
  print = false;
  initiate = true;
  filters: { [field: string]: any; } = {};
  positions: {chosen: Position[], all: Position[]} = {chosen: [], all: []};
  tiers: {chosen: Tier[], all: Tier[]} = {chosen: [], all: []};
  leagues: {chosen: League[], all: League[], allTier: League[]} = {chosen: [], all: [], allTier: []};
  seasons: {chosen: Season[], all: Season[]} = {chosen: [], all: []};
  matches: {chosen: Match[], all: Match[]} = {chosen: [], all: []};
  rounds: {chosen: MatchRound[], all: MatchRound[]} = {chosen: [], all: []};
  showMatchStats = false;
  showRoundStats = false;
  against: boolean;
  leadingChanged = new Subject<boolean>();
  matchesChanged = new Subject<boolean>();
  roundsChanged = new Subject<number>();
  sourceChanged = new Subject<number>();
  filterApplied = new Subject<boolean>();
  fields: string[] = [];
  savedFilters: SavedFilter[];
  activeFilters: any[] = [];
  source = "wyscout";

  get values() {
    return this.source === "wyscout" ? sqlWyscout.values : sqlInstat.values
  }

  get metrics() {
    const map = this.source === "wyscout" ? wyscoutMetricsByGroupMap : instatMetricsByGroupMap;
    return {map, groups: Object.keys(map)}
  }

  get sourcePositions() {
    return this.positions.all.filter(position => {
     return position.source === this.source;
    });
  }

  get sourceTierLeagues() {
    return this.leagues.all.filter(league => {
      const isRightTier = this.tiers.chosen.length === 0 || this.tiers.chosen.map(t => t.tier).includes(league.tier);
      return isRightTier && league.source === this.source
    });
  }

  constructor(
    private leagueService: LeagueService,
    private authService: AuthenticationService,
    private scoutingService: ScoutingService,
  ) {
    window['store'] = this;
    this.seasons = generateSeasonsMultiple();
    this.leagueService.leagues.subscribe((data: LeagueData) => {
      this.leagues.all = data.leagues;
      this.tiers.all = data.tiers;
      this.tiers.chosen = [this.tiers.all.find(tier => tier.tier === 3)];
    });
    this.scoutingService.getPositions().subscribe(data => {
      this.positions.all = transformData(data.data);
      this.positions.all = transformData(data.data);
      this.positions.chosen = [];
    });
  }

  toggleSource() {
    this.source = this.source === "wyscout" ? "instat" : "wyscout";
    this.activeFilters = [];
    this.sourceChanged.next(Math.random());
  }

  loadSavedFilters() {
    this.scoutingService.getFilters(filters => {
      this.savedFilters = sortEqualsValueTop(filters, 'user_id', this.authService.user.id)
    });
  }

  deleteFilter(filter: SavedFilter) {
    if (this.authService.user.id !== filter.user_id) return;
    this.scoutingService.deleteFilter(filter).subscribe((data: any) => {
      const index = this.savedFilters.map(f => f.id).indexOf(filter.id);
      this.savedFilters.splice(index, 1);
    });
  }

  updateFilter(filter: SavedFilter, callback) {
    if (filter.id) {
      this.scoutingService.patchFilter(filter).subscribe((data: Data) => {
        const index = this.savedFilters.map(f => f.id).indexOf(filter.id);
        this.savedFilters.splice(index, 1, filter);
        callback(true);
      });
    } else {
      this.scoutingService.postFilter(filter).subscribe((data: Data) => {
        filter.id = data.data.id;
        this.savedFilters.splice(0, 0, filter);
        callback(true);
      });
    }
  }

  applyFilter(filter: SavedFilter) {
    Object.keys(this.filters).forEach(field => {
      const value = this.values[field];
      this.filters[field].minValue = value ? Math.round(value[0]) : 0;
      this.filters[field].maxValue = value ? Math.round(value[1]) : 50;
    });
    filter.metrics.forEach(metric => {
      if (Object.keys(this.filters).includes(metric.field)) {
        this.filters[metric.field].minValue = metric.minValue;
        this.filters[metric.field].maxValue = metric.maxValue;
      }
    });
    this.filterApplied.next(true);
  }

  fillActiveFilters() {
    this.activeFilters = [];
    for (const key in this.filters) {
      const f = Object.assign({}, this.filters[key]);
      if (f.minValue > 0 || f.maxValue !== f.topOfRange) {
        if (f.field.startsWith('birth')) {
          f.minValue = `${f.minValue}-01-01`;
          f.maxValue = `${f.maxValue}-12-31`;
        }
        this.activeFilters.push(f)
      }
    }
  }

  prioritize(metric) {
    const index = this.fields.indexOf(metric);
    this.fields.splice(index, 1);
    this.fields.splice(0, 0, metric);
  }

  createFilters() {
    this.fields.forEach(field => {
      const value = this.values[field];
      if (!value) console.log(field);
      const filter: Filter = {
        name: capitalizeField(field),
        field: field,
        minValue: Math.round(value ? value[0] : 0),
        bottomOfRange: Math.round(value ? value[0] : 0),
        maxValue: Math.round(value ? value[1] : 50),
        topOfRange: Math.round(value ? value[1] : 50),
        step: step(Math.round(value ? value[1] : 50))
      };
      if (filter.field.startsWith('birth')) {
        filter.name = 'Birthyear';
      }
      this.filters[filter.field] = filter;
    });
  }

  generateFilters(stats) {
    this.fields = Object.keys(stats).filter(s => {
      return !['source', 'player_source_id', 'league_tier', 'season', 'score', 'player_name', 'league_source_id', 'league_name', 'id',
        'team_source_id', 'team_name', 'position', 'primary_position', 'nationality'].includes(s)
    });
    this.createFilters();
    this.initiate = false;
  }
}
