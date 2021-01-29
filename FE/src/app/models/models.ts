import {TagType} from "./enums";
import { cloneDeep } from 'lodash';
import {capitalizeField, matchRoundStartDate, step} from '../functions/shared.functions';
import * as d3 from "d3";
import {dateToSQL} from "../functions/date.functions";
import {createErrorMessage} from "../functions/error.functions";
export type FieldType = "horizontal" | "vertical" | "penalty";

export class LegendItem {
  symbol: any;
  type: string;
  x: number;
  y: number;
  strokeColor: string;
  fillColor: string;
  strokeDashArray: number;

  constructor(type: string, x: number, y: number, symbol, strokeColor: string=null,
              fillColor: string=null,  strokeDashArray=0) {
    this.type = type;
    this.symbol = symbol;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    this.strokeDashArray = type === 'Unsuccessful' ? 3 : strokeDashArray;
    this.x = x;
    this.y = y;
  }
}

export class CallProperties {
  entityName: string;
  dataType: string;

  constructor(type: string, entityName: string) {
    this.entityName = entityName;
    this.dataType = type;
  }

  getErrorMessage() {
    return createErrorMessage(this)
  }
}


export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ChartParameters {
  divId: string;
  id: string;
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  margin: Margin;
  borderColor?: string;
  borderCoeffficient?: number;
  lineStrokeWidth?: number;
  lineOpacity?: number;
  circleRadius?: number;
  markerWidth?: number;
  legendSymbolSize?: number;
  legendItemWidth?: number;
  legendItemHeight?: number;
  legendEdgeWidth?: number;
  legendTopLeftPosition?: Coors;
  nextLegendHorizontalOffset?: number;
  nextLegendVerticalOffset?: number;
  symbolSize?: number;
  symbolOpacity?: number;
  symbolEdgeWidth?: number;
  logoFrameWidth: number;
}

export interface Coors {
  x: number;
  y: number;
  x_to?: number;
  y_to?: number;
}
export interface Data {
  data: any;
}

export interface LeagueData {
  leagues: any[];
  tiers: any[];
}

export class Dimension {
  metric: string;
  name: string;

  constructor(metric: string) {
    this.metric = metric;
    this.name = capitalizeField(metric);
  }
}

export interface Filter {
  name: string;
  field: string;
  minValue: number;
  bottomOfRange: number;
  maxValue: number;
  topOfRange: number;
  step: number;
}

export interface SavedFilter {
  id: number;
  user_id: number;
  user_name: string;
  name: string;
  metrics: Metric[];
}


export interface Metric {
  field: string;
  minValue: any;
  maxValue: any;
}

export interface Season {
  season: any;
}

export interface PercentileType {
  type: any;
}

export interface Position {
  name: string;
  shortcut: string;
  source: string;
}

export interface Tier {
  tier_name: string;
  tier: number;
}

export interface ZoneCount {
  zone: string;
  count: number;
}

export class MatchRound {
  start_date: Date;
  end_date: Date;
  season: Season;
  league: League;
  date_string: string;

  constructor(match_date, league, season) {
    const from_date = matchRoundStartDate(match_date);
    const to_date = cloneDeep(from_date);
    to_date.setDate(to_date.getDate() + 6);
    this.start_date = from_date;
    this.end_date = to_date;
    this.date_string = dateToSQL(from_date);
    this.league = league;
    this.season = season;
  }
}



export class Team {
  source: "wyscout" | "instat";
  source_id: number;
  name?: string;
}

export class League {
  id?: number;
  source_id: number;
  source: "wyscout" | "instat";
  tier: number;
  country_name: string;
  name_country_name: string;
  name: string;

  constructor(source: "wyscout" | "instat", source_id: number, name: string, country_name: string, tier) {
    this.source_id = source_id;
    this.source = source;
    this.name = name;
    this.country_name = country_name;
    this.name_country_name = name + ' - ' + country_name;
    this.tier = tier;
  }
}

export class Radar {
  name: string;
  stats: any[];
}

export interface Player {
  source_id: number;
  source: string;
  name: string;
  player_name?: string;
  position?: string;
}

export class Match {
  source: "wyscout" | "instat";
  season?: Season;
  source_id?: number;
  league: string;
  match_source_id?: number;
  league_source_id?: number;
  home_team: Team;
  hero_name: string;
  guest_team: Team;
  opponent_name: string;
  opponent_source_id?: number;
  home_team_source_id?: number;
  guest_team_source_id?: number;
  match_date: string;
}

export class Tag {
  id: number;
  player_id: number;
  user_id: number;
  tag: string;
  score: number;
  edit: boolean;
  comment: string;
  kind: TagType;
  creation_time: Date;
}


