import {capitalizeAllWords} from "./shared.functions";

export function transformData(data) {
  return data.map(d => {
    const object = {
      'id': d.id
    };
    if (d.hasOwnProperty('attributes')) {
      const keys = Object.keys(d.attributes);
      keys.forEach(key => {
        object[key] = d.attributes[key]
      });
      return object;
    } else {
      return d;
    }
  });
}

export function transformInMap(data, field) {
  const map = {};
  data.forEach(d => {
    const object = {
      'id': d.id
    };
    if (d.hasOwnProperty('attributes')) {
      const keys = Object.keys(d.attributes);
      keys.forEach(key => {
        object[key] = d.attributes[key]
      });
      map[object[field]] = object;
    } else {
      map[d[field]] = d;
    }
  });
  return map;
}

export function filterVisualData(obj: any): any[] {
  let {data, playersOn, typesOn, resultsOn, toBeRemoved, teamsOn, xGOn, shotsOn} = obj;
  if (xGOn) xGOn = xGOn.map(value => parseFloat(value));
  return data.filter(d => {
    const result = d.success ? 'Successful' : 'Unsuccessful';
    const players = !playersOn || playersOn.length === 0 || (playersOn.length > 0 && playersOn.includes(d.player_name));
    const types = !typesOn || typesOn.length === 0 || (typesOn.length > 0 && typesOn.includes(d.type));
    const results = !resultsOn || resultsOn.length === 0 || (resultsOn.length > 0 && resultsOn.includes(result));
    const removed = !toBeRemoved || !toBeRemoved.map(p => p.time).includes(d.time);
    const shots = !shotsOn || shotsOn.length === 0 || (shotsOn.length > 0 && shotsOn.includes(d.type));
    const xG = !xGOn || xGOn.length === 0 || (xGOn.length > 0 && d.xG < Math.max(...xGOn));
    const teams = !teamsOn || teamsOn.length === 0 || (teamsOn.length > 0 && teamsOn.includes(d.team_name));
    console.log(d.type, types, typesOn)
    return players && types && results && removed && shots && xG && teams;
  });
}

export function parseFloats(stats) {
  return stats.map(s => {
    for (const key in s) {
      const result = parseFloat(s[key]);
      if (isNaN(result) || ['season', 'birthday', 'match_date'].includes(key)) {
        continue;
      } else {
        s[key] = Math.round(result * 100) / 100;
      }
    }
    return s;
  });
}


export function filterKeys(s) {
  return !['player_source_id', 'tier', 'season', 'team_id', 'birthday', 'league_country', 'instat_contract', 'year_started_at_club',
    'season_half', 'player_name', 'league_source_id', 'league_name', 'league_tier', 'id', 'version', 'surname',
    'team_source_id', 'team_name', 'primary_position', 'secondary_position', 'nationality', 'transfermarkt_creation_time', 'birthday',
    'instat_creation_time', 'transfermarkt_contract', 'percentile', "match_wyid", "season_wyid", "player_wyid", "league_wyid", "team_wyid"].includes(s)
}



