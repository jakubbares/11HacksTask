
import {dateFromSQL} from "./date.functions";

export function addAgeToData(array: any[]) {
  return array.map(player => calculateAge(player));
}

export function processAgeAndNationality(array: any[]) {
  return array.map(player => {
    player = calculateAge(player)
    const nationality = player.nationality ? player.nationality.split(' ') : "";
    player['nationality'] = nationality.length > 0 ? nationality[0] : '';
    return player;
  });
}

export function addNumber(data: any[]) {
  return data.map((d, index) => {
    d['number'] = index + 1;
    return d;
  })
}

export function setOpponentDate(matches: any) {
  return matches.map(m => {
    m['opponent_date'] = `${m.opponent_name} ${dateFromSQL(m.match_date)}`;
    return m;
  })
}

export function  addHeroOpponentName(matches: any[], hero_team_source_id=null) {
  return matches
    .filter(match => match.home_team_source_id || match.guest_team_source_id)
    .map(match => {
      hero_team_source_id = hero_team_source_id ? hero_team_source_id : match.hero_team_source_id;
      match['opponent_name'] = match.home_team_source_id === hero_team_source_id || match.guest_team_source_id !== hero_team_source_id ? match.guest_team : match.home_team;
      match['hero_name'] = match.home_team_source_id !== hero_team_source_id || match.guest_team_source_id === hero_team_source_id ? match.guest_team : match.home_team;
      return match;
    });
}

export function calculateAge(player) {
  if (player.birthday) {
    player['age'] = Math.floor((new Date().getTime() - new Date(player.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365));
  } else {
    player['age'] = ''
  }
  return player;
}

