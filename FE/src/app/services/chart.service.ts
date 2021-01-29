import {Data, Season} from '../models/models';
import {Injectable, OnInit} from '@angular/core';
import {PlayerService} from "./player.service";
import {LeagueService} from "./league.service";
import {environment} from '../../environments/environment';
import {capitalizeField, flatMap} from '../functions/shared.functions';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {switchCoordidates} from "../functions/visualization.functions";
import {BOTTOM_END_BOX, LEFT_END_BOX, RIGHT_END_BOX} from "../dictionaries/field-dimensions.dict";
import {transformData} from "../functions/data.functions";
import {radarSelectionMap, radarsMap} from "../dictionaries/radar.dict";
import {positionShortcutMap} from "../dictionaries/position.dict";
import {metricsAltNames} from "../dictionaries/metrics.dict";
import {extractFieldValues} from "../functions/extract.functions";



@Injectable()
export class ChartService implements OnInit {
  private baseUrl = `${environment.apiUrl}/charts`;
  radarData: any;
  spiderData: any;
  constructor(
    private playerService: PlayerService,
    private leagueService: LeagueService,
    private http: HttpClient
  ) {
  }
  ngOnInit() {
  }

  getRadarStatsForPlayer(source_and_id: string, season: string, type: string, position: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }
    return this.http.post(this.baseUrl + '/radar', JSON.stringify({ 'data': {source_and_id, season, type, position }}), options)
  }

  getRadarStatsForPlayerAndMatches(source_and_id: string, type: string, position: string, match_source_ids: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }
    return this.http.post(this.baseUrl + '/radar/matches', JSON.stringify({ 'data': {source_and_id, match_source_ids, type, position }}), options)
  }

  getSpiderStatsForPlayers(source: string, player_source_ids: number[], season: string, position: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }
    return this.http.post(this.baseUrl + '/radar/players', JSON.stringify({ 'data': {source, player_source_ids, season, position }}), options)
  }

  getPassesMapJSONForLeagueAndSeason(league_source_and_id: string, season: string) {
    return this.http.get(this.baseUrl + '/passes/map/league/' + league_source_and_id + '/season/' + season)
  }

  getPassesMapJSONForLeagueAndRounds(league_source_and_id: string, start_date: string, end_date: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.post(this.baseUrl + '/passes/map/league/' + league_source_and_id + '/rounds', JSON.stringify({ 'data': { start_date, end_date }}), options)
  }

  getChancesJSONForMatch(match_source_and_id: string) {
    return this.http.get(this.baseUrl + '/chances/match/' + match_source_and_id)
  }

  getPassingCentersJSONForMatch(match_source_and_id: string) {
    return this.http.get(this.baseUrl + '/passing-centers/match/' + match_source_and_id)
  }

  getMovementJSONForTeamAndSeason(team_source_and_id: string, season: string) {
    return this.http.get(this.baseUrl + '/movement/team/' + team_source_and_id + '/season/' + season)
  }

  getChancesJSONForPlayer(player_source_and_id: string) {
    return this.http.get(this.baseUrl + '/chances/player/' + player_source_and_id)
  }

  getChancesJSONForTeamAndMatches(team_source_and_id: string, match_source_ids: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.post(this.baseUrl + '/chances/team/' + team_source_and_id + '/matches', JSON.stringify({ 'data': { match_source_ids }}), options)
  }

  getChancesJSONForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string) {
    return this.http.get(this.baseUrl + '/chances/'+ source + '/team/' + team_source_id + '/league/' + league_source_id + '/season/' + season)
  }

  getDefensiveJSONForMatch(match_source_and_id: string) {
    return this.http.get(this.baseUrl + '/defensive/match/' + match_source_and_id)
  }

  getDefensiveJSONForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string) {
    return this.http.get(this.baseUrl + '/defensive/'+ source + '/team/' + team_source_id + '/league/' + league_source_id + '/season/' + season)
  }

  getDefensiveJSONForTeamAndMatches(team_source_and_id: string, match_source_ids: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.post(this.baseUrl + '/defensive/team/' + team_source_and_id + '/matches', JSON.stringify({ 'data': { match_source_ids }}), options)
  }

  getShotsJSONForMatch(match_source_and_id: string) {
    return this.http.get(this.baseUrl + '/shots/match/' + match_source_and_id)
  }

  getShotsJSONForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string) {
    return this.http.get(this.baseUrl + '/shots/' + source + '/team/' + team_source_id + '/league/' + league_source_id + '/season/' + season)
  }

  getShotsAgainstJSONForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string) {
    return this.http.get(this.baseUrl + '/shots/against/' + source + '/team/' + team_source_id + '/league/' + league_source_id + '/season/' + season)
  }

  getShotsJSONForTeamAndMatches(team_source_and_id: string, match_source_ids: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.post(this.baseUrl + '/shots/team/' + team_source_and_id + '/matches', JSON.stringify({ 'data': { match_source_ids }}), options)
  }

  getShotsAgainstJSONForTeamAndMatches(team_source_and_id: string, match_source_ids: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.post(this.baseUrl + '/shots/against/team/' + team_source_and_id + '/matches', JSON.stringify({ 'data': { match_source_ids }}), options)
  }

  getAllPercentiles() {
    return this.http.get(this.baseUrl + '/percentiles')
  }

  getShotsJSONForPlayer(player_source_and_id: string) {
    return this.http.get(this.baseUrl + '/shots/player/' + player_source_and_id)
  }

  getPlayerPassesJSONForTeamAndMatch(source: string, team_source_id: number, match_source_id: number) {
    return this.http.get(this.baseUrl + '/passes/player/' + source + '/team/' + team_source_id + '/match/' + match_source_id)
  }

  getPlayerPassesJSONForMatch(source: string, player_source_id: number, match_source_id: number) {
    return this.http.get(this.baseUrl + '/passes/player/' + source + '/player/' + player_source_id + '/match/' + match_source_id)
  }

  getPlayerPassesJSONForTeamAndLeague(source: string, player_source_id: number, team_source_id: number, league_source_id: number) {
    return this.http.get(this.baseUrl + '/passes/player/' + source + '/player/' + player_source_id + '/team/' + team_source_id + '/league/' + league_source_id)
  }

  getTeamPassesJSONForLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: Season) {
    return this.http.get(this.baseUrl + '/passes/team/' + source + '/team/' + team_source_id + '/league/' + league_source_id + '/season/' + season.season)
  }

  getPlayerPassesJSONForMatches(player_source_and_id: string, match_source_ids: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };
    return this.http.post(this.baseUrl + '/passes/player/' + player_source_and_id + '/matches', JSON.stringify({ 'data': { match_source_ids }}), options)
  }

  getTeamPassesJSONForMatch(source: string, team_source_id: number, match_source_id: number) {
    return this.http.get(this.baseUrl + '/passes/team/' + source + '/team/' + team_source_id + '/match/' + match_source_id)
  }

  getTeamPassesZonesJSONForMatch(source: string, team_source_id: number, match_source_id: number) {
    return this.http.get(this.baseUrl + '/passes/zones/team/' + source + '/team/' + team_source_id + '/match/' + match_source_id)
  }

  getSonarForPlayer(player_source_and_id: string) {
    return this.http.get(this.baseUrl + '/sonar/player/' + player_source_and_id)
  }

  getPlayerPassesForTeamAndLeague(source: string, player_source_id: number, team_source_id: number, league_source_id: number, callback) {
    this.getPlayerPassesJSONForTeamAndLeague(source, player_source_id, team_source_id, league_source_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPlayerPassesMatchFromJSON(data);
        callback(data);
      }
    })
  }

  getTeamPassesForLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season:Season, callback) {
    this.getTeamPassesJSONForLeagueAndSeason(source, team_source_id, league_source_id, season).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractTeamPassesMatchFromJSON(data);
        callback(data);
      }
    })
  }

  getPlayerPassesForMatch(source: string, player_source_id: number, match_source_id: number, callback) {
    this.getPlayerPassesJSONForMatch(source, player_source_id, match_source_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPlayerPassesMatchFromJSON(data);
        callback(data);
      }
    })
  }

  getPlayerPassesForTeamAndMatch(source: string, team_source_id: number, match_source_id: number, callback) {
    this.getPlayerPassesJSONForTeamAndMatch(source, team_source_id, match_source_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPlayerPassesMatchFromJSON(data);
        callback(data);
      }
    })
  }

  getPlayerPassesForMatches(player_source_and_id: string, match_source_ids: number[], callback) {
    this.getPlayerPassesJSONForMatches(player_source_and_id, match_source_ids).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPlayerPassesMatchFromJSON(data);
        callback(data);
      }
    })
  }

  getPassingForTeamAndMatch(source: string, team_source_id: number, match_source_id: number, callback) {
    this.getTeamPassesJSONForMatch(source, team_source_id, match_source_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractTeamPassesMatchFromJSON(data);
        data = data.length ? data.flatMap(match => match.items) : [];
        callback(data);
      }
    })
  }

  getPassingZonesForTeamAndMatch(source: string, team_source_id: number, match_source_id: number, callback) {
    this.getTeamPassesZonesJSONForMatch(source, team_source_id, match_source_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractTeamPassesZonesMatchFromJSON(data);
        data = data.length ? data.flatMap(match => match.items) : [];
        callback(data);
      }
    })
  }

  getShotsForPlayer(player_source_and_id: string, callback) {
    this.getShotsJSONForPlayer(player_source_and_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractShotsSeasonPlayerFromJSON(data);
        callback(data);
      }
    })
  }

  getShotsForMatch(match_source_and_id: string, callback) {
    this.getShotsJSONForMatch(match_source_and_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractShotsMatchTeamFromJSON(data)
        callback(data);
      }
    })
  }

  getShotsForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string, callback) {
    this.getShotsJSONForTeamLeagueAndSeason(source, team_source_id, league_source_id, season).subscribe((t: Data) => {
      if (t.data) {
        const data = this.extractShotsSeasonTeamFromJSON(t.data);
        callback(data);
      }
    })
  }

  getShotsAgainstForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string, callback) {
    this.getShotsAgainstJSONForTeamLeagueAndSeason(source, team_source_id, league_source_id, season).subscribe((t: Data) => {
      if (t.data) {
        const data = this.extractShotsSeasonTeamFromJSON(t.data);
        callback(data);
      }
    })
  }

  getShotsForTeamAndMatches(team_source_and_id: string, match_source_ids: number[], callback) {
    this.getShotsJSONForTeamAndMatches(team_source_and_id, match_source_ids).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractShotsMatchTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getShotsAgainstForTeamAndMatches(team_source_and_id: string, match_source_ids: number[], callback) {
    this.getShotsAgainstJSONForTeamAndMatches(team_source_and_id, match_source_ids).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractShotsMatchTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getChancesForMatch(match_source_and_id: string, callback) {
    this.getChancesJSONForMatch(match_source_and_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractChancesMatchTeamFromJSON(data)
        callback(data);
      }
    })
  }

  getChancesForTeamAndMatches(team_source_and_id: string, match_source_ids: number[], callback) {
    this.getChancesJSONForTeamAndMatches(team_source_and_id, match_source_ids).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractChancesMatchTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getChancesForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string, callback) {
    this.getChancesJSONForTeamLeagueAndSeason(source, team_source_id, league_source_id, season).subscribe((t: Data) => {
      if (t.data) {
        const data = this.extractChancesSeasonTeamFromJSON(t.data);
        callback(data);
      }
    })
  }

  getPassesMapForLeagueAndSeason(league_source_and_id: string, season: string, callback) {
    this.getPassesMapJSONForLeagueAndSeason(league_source_and_id, season).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPassingMapSeasonTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getPassesMapForLeagueAndRounds(league_source_and_id: string, start_date: string, end_date: string, callback) {
    this.getPassesMapJSONForLeagueAndRounds(league_source_and_id, start_date, end_date).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPassingMapRoundsTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getPassingCentersForMatch(match_source_and_id: string, callback) {
    this.getPassingCentersJSONForMatch(match_source_and_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractPassingCentersMatchTeamFromJSON(data)
        callback(data);
      }
    })
  }

  getMovementForTeamAndSeason(team_source_and_id: string, season: string, callback) {
    this.getMovementJSONForTeamAndSeason(team_source_and_id, season).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractMovementSeasonTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getChancesForPlayer(player_source_and_id: string, callback) {
    this.getChancesJSONForPlayer(player_source_and_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractChancesSeasonPlayerFromJSON(data)
        callback(data);
      }
    })
  }

  getDefensiveForTeamAndMatches(team_source_and_id: string, match_source_ids: number[], callback) {
    this.getDefensiveJSONForTeamAndMatches(team_source_and_id, match_source_ids).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractChallengesMatchTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getDefensiveForMatch(match_source_and_id: string, callback) {
    this.getDefensiveJSONForMatch(match_source_and_id).subscribe((t: Data) => {
      if (t.data) {
        let data = transformData(t.data);
        data = this.extractChallengesMatchTeamFromJSON(data);
        callback(data);
      }
    })
  }

  getDefensiveForTeamLeagueAndSeason(source: string, team_source_id: number, league_source_id: number, season: string, callback) {
    this.getDefensiveJSONForTeamLeagueAndSeason(source, team_source_id, league_source_id, season).subscribe((t: Data) => {
      if (t.data) {
        const data = this.extractChallengesSeasonTeamFromJSON(t.data);
        callback(data);
      }
    })
  }

  extractMovementSeasonTeamFromJSON(data) {
    return data.map(zone => {
      zone['zones_to'] = JSON.parse(zone['json'])
      return zone;
    });
  }

  extractPassingMapSeasonTeamFromJSON(data) {
    return data.map(team => {
      team['zones'] = JSON.parse(team['json']).map(item => {
        return {
          zone: item[0],
          count_from: item[1],
          count_to: item[2],
          count_from_against: item[3],
          count_to_against: item[4],
        }
      });
      return team;
    });
  }

  extractPassingMapRoundsTeamFromJSON(data) {
    return data.map(team => {
      const zones = flatMap(JSON.parse('['+team['json']+']')).map(item => {
        return {
          zone: item[0],
          count_from: item[1],
          count_to: item[2],
          count_from_against: item[3],
          count_to_against: item[4],
        }
      });
      const from = {};
      const to  = {};
      const from_against  = {};
      const to_against  = {};
      zones.forEach(item => {
        from[item.zone] = from[item.zone] !== undefined  ? from[item.zone] + parseInt(item.count_from) : parseInt(item.count_from);
        to[item.zone] = to[item.zone] !== undefined  ? to[item.zone] + parseInt(item.count_to) : parseInt(item.count_to);
        from_against[item.zone] = from_against[item.zone] !== undefined  ? from_against[item.zone] + parseInt(item.count_from_against) : parseInt(item.count_from_against);
        to_against[item.zone] = to_against[item.zone] !== undefined  ? to_against[item.zone] + parseInt(item.count_to_against) : parseInt(item.count_to_against);
      });
      team['zones'] = Object.keys(from).map(zone => {
        return { zone, count_from: from[zone], count_to: to[zone], count_from_against: from_against[zone], count_to_against: to_against[zone] }
      });
      return team;
    });
  }

  extractPassingCentersMatchTeamFromJSON(data) {
    return data.map(team => {
      team['passes'] = JSON.parse(team['passes']).map(item => {
        return {
          from: item[0],
          to: item[1],
          count: item[2]
        }
      });
      team['players'] = JSON.parse(team['players']).map(item => {
        return {
          player_source_id: item[0],
          player_name: item[1],
          x: item[2],
          y: item[3],
          count: item[4],
          minutes: item[5]
        }
      });
      return team;
    });
  }

  returnPassForPlayerAndMatch(item: any, type: string) {
    type = type.replace('inaccurate', '').replace('accurate', '').trim();
    return {
      type: capitalizeField(type),
      zone_from: item[1],
      zone_to: item[2],
      x_from: item[3],
      y_from: item[4],
      x_to: item[5],
      y_to: item[6],
      time: item[7],
      success: !item[0].includes('inaccurate')
    }
  }

  extractPlayerPassesMatchFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      d['items'] = array.flatMap(item => {
        const typeOrTypes = item[0];
        if (Array.isArray(typeOrTypes)) {
          return typeOrTypes.map(type => this.returnPassForPlayerAndMatch(item, type))
        } else {
          return this.returnPassForPlayerAndMatch(item, typeOrTypes);
        }
      });
      return d
    });
  }

  extractTeamPassesMatchFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      d['items'] = array.map(item => {
        return {
          player_source_id: item[0],
          player_name: item[1],
          type: item[2].replace('inaccurate', '').replace('accurate', '').trim(),
          zone_from: item[3],
          zone_to: item[4],
          x_from: item[5],
          y_from: item[6],
          x_to: item[7],
          y_to: item[8],
          time: item[9],
          success: !item[2].includes('inaccurate')
        }
      });
      return d
    });
  }

  extractTeamPassesZonesMatchFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      d['items'] = array.map(item => {
        return {
          type: item[0],
          zone_from: item[1],
          zone_to: item[2],
          count: item[3]
        }
      });
      return d
    });
  }

  extractShotsMatchTeamFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      d['items'] = array.map(item => {
        const shot = {
          player_source_id: item[0],
          player_name: item[1],
          result: item[2],
          type: item[3],
          x: item[4],
          y: item[5],
          xG: item[6],
          time: item[7],
          team_source_id: d.team_source_id,
          other_team_source_id: d.other_team_source_id,
          team_name: d.team_name,
          source: d.source
        };
        if (d.source === "wyscout") {
          shot["assist_type"] = item[8];
          shot["assist_x"] = item[9];
          shot["assist_y"] = item[10];
        }
        return shot;
      });
      return d
    });
  }


  extractShotsSeasonTeamFromJSON(data) {
    data['items'] = data['shots'].map(item => {
      return {
        player_source_id: item[0],
        player_name: item[1],
        result: item[2],
        type: item[3],
        x: item[4],
        y: item[5],
        xG: item[6],
        time: item[7],
        team_name: item[8],
      };
    });
    return data;
  }

  extractShotsSeasonPlayerFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      d['items'] = array.map(item => {
        const shot = {
          player_source_id: d.player_source_id,
          player_name: d.player_name,
          team_name: '',
          result: item[0],
          type: item[1],
          x: item[2],
          y: item[3],
          xG: item[4],
          time: item[5],
          source: d.source
        };
        if (d.source === "wyscout") {
          shot["assist_type"] = item[6];
          shot["assist_x"] = item[7];
          shot["assist_y"] = item[8];
        }
        return shot;
      });
      return d
    });
  }

  extractChancesSeasonTeamFromJSON(data) {
    data['items'] = data['chances'].map(item => {
      return {
        player_source_id: item[0],
        player_name: item[1],
        player_number: item[2],
        type: item[3],
        x_from: item[4],
        y_from: item[5],
        x_to: item[6],
        y_to: item[7],
        time: item[8],
        success: item[9]
      }
    });
    return data;
  }

  extractChancesSeasonPlayerFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      const items = array.map(item => {
        return {
          type: item[0],
          x_from: item[1],
          y_from: item[2],
          x_to: item[3],
          y_to: item[4],
          time: item[5],
          success: item[6],
          player_source_id: d.player_source_id,
          player_name: d.player_name,
          player_number: d.player_number
        }
      });
      d['items'] = items;
      return d
    });
  }

  extractChancesMatchTeamFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      const items = array.map(item => {
        return {
          player_source_id: item[0],
          player_name: item[1],
          player_number: item[2],
          type: item[3],
          x_from: item[4],
          y_from: item[5],
          x_to: item[6],
          y_to: item[7],
          time: item[8],
          success: item[9]
        }
      });
      d['items'] = items;
      return d
    });
  }

  extractChallengesSeasonTeamFromJSON(data) {
    data['items'] = data['defensive'].map(item => {
      return {
        player_source_id: item[0],
        player_name: item[1],
        type: item[2],
        x: item[3],
        y: item[4],
        time: item[5],
        success: item[6]
      }
    });
    return data;
  }

  extractChallengesMatchTeamFromJSON(data) {
    return data.map(d => {
      const array = JSON.parse(d.json);
      const items = array.map(item => {
        return {
          player_source_id: item[0],
          player_name: item[1],
          type: item[2],
          x: item[3],
          y: item[4],
          time: item[5],
          success: item[6]
        }
      });
      d['items'] = items;
      return d
    });
  }

  processSpiders(source: string = "wyscout", position: string = null) {
    const data = this.spiderData;
    position = position ? position : Object.keys(data.percentiles)[0];
    const percentiles = data.percentiles[position];
    const spiders = [];
    for (const player in data.players) {
      const headers = data.players[player].headers;
      const metricsArray = data.players[player].metrics;
      headers.map((header: any, i) => {
        const metrics = metricsArray[i];
        const radars = radarsMap.find(r => r.name === positionShortcutMap[position]);

        if (!radars) {
          return;
        }
        radars.radars.filter(rad => radarSelectionMap[source][positionShortcutMap[position]].includes(rad.name)).forEach(rad => {
          const chart = {
            'name': rad.name,
            'player_name': header.player_name,
            'player_source_id': player,
            'season': header.season,
            'team_name': header.team_name,
            'league_name': header.league_name,
            'league_tier': header.league_tier,
            'minutes': header.minutes,
            'primary_position': capitalizeField(positionShortcutMap[position]),
            'stats': {},
            'statsArray': []
          };
          rad.fields.forEach((metric, index) => {
            if (metric in metrics) {
              if (Object.keys(metricsAltNames).includes(metric)) {
                const stat = {
                  'name': metricsAltNames[metric].name,
                  'shortcut': metricsAltNames[metric].short,
                  'field': metric,
                  'level': metrics[metric].level,
                  'value': metrics[metric].value,
                  'percentiles': percentiles[metric]
                };
                if (Object.keys(chart.stats).length < 10) {
                  chart.stats[metric] = stat;
                  chart.statsArray.push(stat);
                }
              } else {
                console.log(metric)
              }
            }
          });
          if (Object.keys(chart.stats).length > 0) {
            spiders.push(chart);
          }
        });
      });
    }
    return { spiders, percentiles };
  }


  getSpidersForPlayers(source: string, player_source_ids: number[], season: string, position: string, callback) {
    this.getSpiderStatsForPlayers(source, player_source_ids, season, position).subscribe((data: any) => {
      this.spiderData = data;
      const { spiders, percentiles } = this.processSpiders(source, position);
      callback(spiders, percentiles);
    });
  }

  processRadars(source: string = "wyscout", position: string = null) {
    const data = this.radarData;
    const metricsArray = data.metrics;
    const headers = data.headers;
    const percentiles = data.percentiles;
    const output = [];
    headers.map((header, i) => {
      position = position ? position : header.primary_position;
      const metrics = metricsArray[i];
      const results = [];
      const radars = radarsMap.find(r => r.name === positionShortcutMap[position]);
      if (!radars) {
        return;
      }
      header.primary_position = capitalizeField(positionShortcutMap[position]);
      radars.radars.filter(rad => {
        const positionName = positionShortcutMap[position];
        return radarSelectionMap[source][positionName].includes(rad.name)
      }).forEach(rad => {
        const radar = {
          name: capitalizeField(rad.name),
          stats: []
        };
        rad.fields.forEach((metric, index) => {
          if (metric in metrics) {
            if (Object.keys(metricsAltNames).includes(metric)) {
              const stat = {
                "radar_name": capitalizeField(rad.name),
                'name': metricsAltNames[metric].name,
                'shortcut': metricsAltNames[metric].short,
                'field': metric,
                'level': metrics[metric].level,
                'value': metrics[metric].value,
                'percentiles': percentiles[metric]
              };
              if (radar.stats.length < 10) {
                radar.stats.push(stat)
              }
            } else {
              console.log(metric);
            }
          }
        });
        if (radar.stats.length > 1) {
          results.push(radar);
        }
      });
      output.push({radars: results, header: header});
    });
    return output;
  }

  getRadarsForPlayerAndMatches(source: string, source_id: number, type: string, position: string, match_source_ids: number[], callback) {
    this.getRadarStatsForPlayerAndMatches(source + source_id, type, position, match_source_ids).subscribe((data: Data) => {
      if (data.data) {
        this.radarData = data.data;
        callback(this.processRadars(source, position));
      } else {
        callback([], true)
      }
    }, error => callback([], error));
  }

  getRadarsForPlayer(source: string, source_id: number, season: string, type: string, position, callback) {
    this.getRadarStatsForPlayer(source + source_id, season, type, position).subscribe((data: Data) => {
      if (data.data) {
        this.radarData = data.data;
        callback(this.processRadars(source, position));
      } else {
        callback([])
      }
    }, error => callback([], error));
  }

  getHeatMapForMatchAndTeam(type, source, match_source_id, team_source_id, callback) {
    if (type === 'defensive') {
      this.getDefensiveForMatch(source + match_source_id, data => {
        const stats = data.find(x => x.team_source_id === team_source_id);
        const players = stats ? extractFieldValues(stats.items, 'player_name') : [];
        const results = stats ? stats.items.map(x => { return {coor: [x.x, x.y, 5], player_name: x.player_name, type: x.type}}) : [];
        callback(players, results)
      });
    }
  }

  getHeatMapForPlayerTeamAndLeague(type, source, player_source_id, team_source_id, league_source_id, callback) {
    if (type === 'passes reception') {
      this.getPlayerPassesForTeamAndLeague(source, player_source_id, team_source_id, league_source_id, data => {
        const passes = data.flatMap(match => match.items);
        const results = passes.map(pass => { return {coor: [pass.x_to, pass.y_to, 5], type: pass.type}});
        callback(results, passes)
      });
    }
  }

  getHeatMapForTeamLeagueAndSeason(type, source: string, team_source_id: number, league_source_id: number, season: Season, callback) {
    if (type === 'passes to penalty') {
      this.getTeamPassesForLeagueAndSeason(source, team_source_id, league_source_id, season, data => {
        const passes = data.flatMap(match => match.items)
          .filter(pass => {
            return pass.x_from >= 105/2 && (pass.x_from <= BOTTOM_END_BOX || pass.y_from <= LEFT_END_BOX || pass.y_from >= RIGHT_END_BOX) &&
            pass.x_to >= BOTTOM_END_BOX && pass.y_to >= LEFT_END_BOX && pass.y_to <= RIGHT_END_BOX
          });
        const results = passes.map(pass => { return {coor: [pass.x_from, pass.y_from, 5], type: pass.type}});
        callback(results, passes)
      });
    }
  }

}
