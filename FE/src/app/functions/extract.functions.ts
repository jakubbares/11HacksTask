import {League, Season, Team} from "../models/models";
import {getSingleYearSeason} from "./date.functions";

export function extractFieldValues(array, field) {
  return Array.from(new Set(array.filter(s => s[field]).map(s => s[field]))).map(x => x.toString());
}

export function extractForRightSeason(extractFn, data, season) {
  let filtered = data.filter(d => d.season === season);
  filtered = filtered.length ? filtered : data.filter(d => d.season === getSingleYearSeason(season));
  return extractFn(filtered)
}

export function extractClubs(array): { all: Team[], chosen: Team } {
  const team_ids = Array.from(new Set(array.map(s => s.team_source_id)));
  const source = array[0].source;
  let teams: Team[] = team_ids.map((s: number) => {
    const team = array.find(l => l.team_source_id === s);
    return {source, source_id: s, name: team.team_name, id: null }
  });
  teams = teams.sort((a: any, b: any) => b.source_id - a.source_id);
  const majorTeam = teams.length > 0 ? teams[0] : null;
  return { all: teams, chosen: majorTeam };
}



export function extractLeagues(array): { all: League[], chosen: League } {
  const leagues_ids = Array.from(new Set(array.map(s => s.league_source_id)));
  const source = array[0].source;
  let leagues: League[] = leagues_ids.map((s: number) => {
    const league = array.find(l => l.league_source_id === s);
    return {source, source_id: s, name: league.league_name, id: null, tier: league.tier, country_name: null, name_country_name: null }
  });
  leagues = leagues.sort((a: any, b: any) => b.source_id - a.source_id);
  const majorLeague = leagues.length > 0 ? leagues[0] : null;
  return { all: leagues, chosen: majorLeague };
}

export function extractSeasons(array): { all: Season[], chosen: Season} {
  let seasons = Array.from(new Set(array.map(s => s.season)))
    .filter((s: string) => s && s.includes('-'))
    .map(s => {return {season: s}});
  seasons = seasons.sort((a: any, b: any) => b.season - a.season);
  const lastSeason = seasons.length > 0 ? seasons[0] : null;
  return { all: seasons, chosen: lastSeason };
}
