import * as moment from "moment";
import {Season} from "../models/models";
import {add0IfNecessary} from "./shared.functions";
import { cloneDeep } from "lodash";
import * as _ from 'lodash'


const monthNames = ["Jan", 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec']

export function dateFromDate(date: Date) {
  return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}

export function dateFromSQL(sqlDate) {
  const date = new Date(sqlDate);
  return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}

export function matchRoundDate(startDate) {
  const endDate = cloneDeep(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${startDate.getDate()} ${monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]}, ${startDate.getFullYear()}`;
}

export function dateToSQL(date: Date) {
  const month = add0IfNecessary(date.getMonth()+1);
  const day = add0IfNecessary(date.getDate());
  return `${date.getFullYear()}-${month}-${day}`;
}

export function dateFromCzech(czechDate) {
  const date = moment(czechDate, "DD.MM.YYYY").toDate();
  return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}

export function parseTime(time) {
  time = parseFloat(time);
  const minutes = Math.round(time / 60);
  const seconds = Math.round(time % 60);
  return `${minutes}:${seconds}`
}


export const sortBySeason = (a: any, b: any) => parseInt(b.season) - parseInt(a.season);

export function seasonFromDate(date: Date) {
  const year = date.getMonth() + 1 >= 8 ? date.getFullYear() + 1 : date.getFullYear();
  return {season: `${year - 1}-${year}`}
}

export function getSingleYearSeason(season: string) {
  return season.substr(0, 4);
}

export function generateSeasons(): { all: Season[], chosen: Season} {
  const lastYear = new Date().getMonth() + 1 >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const firstYear = 2014;
  const seasons = _.range(firstYear, lastYear + 1).map(year => {return {season: `${year}-${year + 1}`}}).reverse();
  return { all: seasons, chosen: seasons[0] };
}

export function currentSeason(): Season {
  return seasonFromDate(new Date);
}

export function generateSeasonsMultiple(): { all: Season[], chosen: Season[]} {
  const lastYear = new Date().getMonth() + 1 >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;
  const firstYear = 2014;
  const seasons = _.range(firstYear, lastYear + 1).map(year => {return {season: `${year}-${year + 1}`}}).reverse();
  return { all: seasons, chosen: [seasons[0]] };
}
