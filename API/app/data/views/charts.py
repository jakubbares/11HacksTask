from flask import Blueprint, request, jsonify, make_response
from sqlalchemy.sql.elements import and_
from app.data.wyscout_models import JSONWyShotsMatchTeam, JSONWyShotsSeasonPlayer, JSONWyPassingCentersMatchTeam, WyTeamLeagueLink, \
SparkWyPassesSonarSeasonPlayer, JSONWyPassesMatchPlayer, JSONWyPassesMatchTeam, JSONWyPassesZonesMatchTeam
from app.data.wyscout_schemas import JSONWyMatchTeamSchema, JSONWySeasonPlayerSchema, JSONWyMatchPlayerSchema, JSONWyPassingCentersMatchTeamSchema, \
SparkWyPassesSonarSeasonPlayerSchema
from app.data.models import db, JSONShotsMatchTeam, JSONShotsSeasonPlayer, SparkPassesSonarSeasonPlayer, Match, JSONPassingCentersMatchTeam, \
JSONPassesMatchTeam, JSONPassesMapSeasonTeam, JSONPassesMapRoundTeam,  JSONChallengesMatchTeam, JSONChancesMatchTeam, JSONChancesSeasonPlayer, \
JSONMovementSeasonTeam, JSONPassesMatchPlayer, JSONPassesZonesMatchTeam, JSONXgDevelopmentMatchTeam
from app.data.helper import process_source_and_id, process_source_ids
from app.data.schemas import JSONMatchTeamSchema, JSONSeasonPlayerSchema, SparkPassesSonarSeasonPlayerSchema, JSONPassingCentersMatchTeamSchema, \
JSONPassesMatchTeamSchema, JSONPassesMapTeamSchema, JSONMovementSeasonTeamSchema, JSONMatchPlayerSchema
from flask_restful import Api, Resource
from sqlalchemy.exc import SQLAlchemyError
from marshmallow import ValidationError
import json
from sqlalchemy import distinct, func, case
from decimal import Decimal
stats = Blueprint('stats', __name__)
import pandas as pd
from app.data import decimal_default

wyMatchTeamSchema = JSONWyMatchTeamSchema()
matchTeamSchema = JSONMatchTeamSchema()
wyMatchPlayerSchema = JSONWyMatchPlayerSchema()
matchPlayerSchema = JSONMatchPlayerSchema()
seasonPlayerSchema = JSONSeasonPlayerSchema()
wySeasonPlayerSchema = JSONWySeasonPlayerSchema()
sonarSchema = SparkPassesSonarSeasonPlayerSchema()
wySonarSchema = SparkWyPassesSonarSeasonPlayerSchema()
centersSchema = JSONPassingCentersMatchTeamSchema()
wyCentersSchema = JSONWyPassingCentersMatchTeamSchema()
teamPassesSchema = JSONPassesMatchTeamSchema()
passesMapSchema = JSONPassesMapTeamSchema()
movementSchema = JSONMovementSeasonTeamSchema()

class ChartsList(Resource):
    @staticmethod
    def getPassesSonarForPlayer(player_source_and_id):
        source, source_id = process_source_and_id(player_source_and_id)
        if source == "wyscout":
            query = SparkWyPassesSonarSeasonPlayer.query.filter(SparkWyPassesSonarSeasonPlayer.player_wyid == source_id).all()
            results = wySonarSchema.dump(query, many=True).data
        else:
            query = SparkPassesSonarSeasonPlayer.query.filter(SparkPassesSonarSeasonPlayer.player_instatid == source_id).all()
            results = sonarSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getShotsForTeamLeagueAndSeason(source, team_source_id, league_source_id, season):
        if source == "instat":
            query = JSONShotsMatchTeam.query\
                .filter(JSONShotsMatchTeam.season == season)\
                .filter(JSONShotsMatchTeam.league_instatid == league_source_id) \
                .filter(JSONShotsMatchTeam.team_instatid == team_source_id).all()
            results = matchTeamSchema.dump(query, many=True).data
        else:
            query = JSONWyShotsMatchTeam.query\
                .filter(JSONWyShotsMatchTeam.season == season)\
                .filter(JSONWyShotsMatchTeam.league_wyid == league_source_id) \
                .filter(JSONWyShotsMatchTeam.team_wyid == team_source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        agg_results = {}
        all_shots = []
        for index, x in enumerate(results['data']):
            match = x['attributes']
            def add_info(shot):
                shot.append(match['team_name'])
                return shot
            shots = json.loads(match['json'])
            shots = [add_info(shot) for shot in shots]
            all_shots.extend(shots)
            if index == 0:
                agg_results['season'] = match['season']
                agg_results['team_source_id'] = match['team_source_id']
                agg_results['league_source_id'] = match['league_source_id']
        agg_results['shots'] = all_shots
        return json.dumps({'data': agg_results}, default=decimal_default)


    @staticmethod
    def getShotsAgainstForTeamLeagueAndSeason(source, team_source_id, league_source_id, season):
        if source == "instat":
            query = JSONShotsMatchTeam.query\
                .filter(JSONShotsMatchTeam.season == season)\
                .filter(JSONShotsMatchTeam.league_instatid == league_source_id) \
                .filter(JSONShotsMatchTeam.other_team_instatid == team_source_id).all()
            results = matchTeamSchema.dump(query, many=True).data
        else:
            query = JSONWyShotsMatchTeam.query\
                .filter(JSONWyShotsMatchTeam.season == season)\
                .filter(JSONWyShotsMatchTeam.league_wyid == league_source_id) \
                .filter(JSONWyShotsMatchTeam.other_team_wyid == team_source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        agg_results = {}
        all_shots = []
        for index, x in enumerate(results['data']):
            match = x['attributes']
            def add_info(shot):
                shot.append(match['team_name'])
                return shot
            shots = json.loads(match['json'])
            shots = [add_info(shot) for shot in shots]
            all_shots.extend(shots)
            if index == 0:
                agg_results['season'] = match['season']
                agg_results['league_source_id'] = match['league_source_id']
                agg_results['team_source_id'] = match['team_source_id']
        agg_results['shots'] = all_shots
        return json.dumps({'data': agg_results}, default=decimal_default)

    @staticmethod
    def getShotsForMatch(match_source_and_id):
        source, source_id = process_source_and_id(match_source_and_id)
        if source == "instat":
            query = JSONShotsMatchTeam.query.filter(JSONShotsMatchTeam.match_instatid == source_id).all()
            results = matchTeamSchema.dump(query, many=True).data
        else:
            query = JSONWyShotsMatchTeam.query.filter(JSONWyShotsMatchTeam.match_wyid == source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)


    @staticmethod
    def getShotsForTeamAndMatches(team_source_and_id):
        source, source_id = process_source_and_id(team_source_and_id)
        raw_dict = request.get_json(force=True)
        dict = raw_dict['data']
        if source == "instat":
            query = JSONShotsMatchTeam.query.filter(JSONShotsMatchTeam.match_instatid.in_(dict['match_source_ids'])) \
                                      .filter(JSONShotsMatchTeam.team_instatid == source_id).all()
            results = matchTeamSchema.dump(query, many=True).data
        else:
            query = JSONWyShotsMatchTeam.query.filter(JSONWyShotsMatchTeam.match_wyid.in_(dict['match_source_ids'])) \
                                        .filter(JSONWyShotsMatchTeam.team_wyid == source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getShotsAgainstForTeamAndMatches(team_source_and_id):
        source, source_id = process_source_and_id(team_source_and_id)
        raw_dict = request.get_json(force=True)
        dict = raw_dict['data']
        if source == "instat":
            query = JSONShotsMatchTeam.query.filter(JSONShotsMatchTeam.match_instatid.in_(dict['match_source_ids'])) \
                                      .filter(JSONShotsMatchTeam.other_team_instatid == source_id).all()
            results = matchTeamSchema.dump(query, many=True).data
        else:
            query = JSONWyShotsMatchTeam.query.filter(JSONWyShotsMatchTeam.match_wyid.in_(dict['match_source_ids'])) \
                                        .filter(JSONWyShotsMatchTeam.other_team_wyid == source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)


    @staticmethod
    def getShotsForPlayer(player_source_and_id):
        source, source_id = process_source_and_id(player_source_and_id)
        query = JSONShotsSeasonPlayer.query.filter(JSONShotsSeasonPlayer.player_instatid == source_id).all()
        if source == "instat":
            query = JSONShotsSeasonPlayer.query.filter(JSONShotsSeasonPlayer.player_instatid == source_id).all()
            results = seasonPlayerSchema.dump(query, many=True).data
        else:
            query = JSONWyShotsSeasonPlayer.query.filter(JSONWyShotsSeasonPlayer.player_wyid == source_id).all()
            results = wySeasonPlayerSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getPassingCentersForMatch(match_source_and_id):
        source, source_id = process_source_and_id(match_source_and_id)
        if source == "wyscout":
            query = JSONWyPassingCentersMatchTeam.query.filter(JSONWyPassingCentersMatchTeam.match_wyid == source_id).all()
            results = wyCentersSchema.dump(query, many=True).data
        else:
            query = JSONPassingCentersMatchTeam.query.filter(JSONPassingCentersMatchTeam.match_instatid == source_id).all()
            results = centersSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getPassingMapForLeagueAndSeason(league_source_and_id, season):
        source, source_id = process_source_and_id(league_source_and_id)
        query = JSONPassesMapSeasonTeam.query \
                     .filter(JSONPassesMapSeasonTeam.league_instatid == source_id) \
                     .filter(JSONPassesMapSeasonTeam.season == season).all()
        results = passesMapSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)


    @staticmethod
    def getMovementForTeamAndSeason(team_source_and_id, season):
        source, source_id = process_source_and_id(team_source_and_id)
        query = JSONMovementSeasonTeam.query \
                     .filter(JSONMovementSeasonTeam.season == season) \
                     .filter(JSONMovementSeasonTeam.team_instatid == source_id).all()
        results = movementSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getPassingMapForLeagueAndRounds(league_source_and_id):
        source, source_id = process_source_and_id(league_source_and_id)
        raw_dict = request.get_json(force=True)
        dict = raw_dict['data']
        Map = JSONPassesMapRoundTeam
        query = db.session.query(Map.team_instatid, Map.league_instatid, Map.team_name, Map.season,
                                 func.string_agg(Map.json, ',').label('json')) \
                                 .filter(Map.league_instatid == source_id) \
                                 .filter(Map.round_start >= dict['start_date']) \
                                 .filter(Map.round_start <= dict['end_date']) \
                                 .group_by(Map.team_instatid, Map.league_instatid, Map.team_name, Map.season).all()
        results = passesMapSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getPassesForPlayerAndMatches(player_source_and_id):
        source, source_id = process_source_and_id(player_source_and_id)
        raw_dict = request.get_json(force=True)
        dict = raw_dict['data']
        if source == "wyscout":
            query = JSONWyPassesMatchPlayer.query.filter(JSONWyPassesMatchPlayer.match_wyid.in_(dict['match_source_ids'])) \
                                  .filter(JSONWyPassesMatchPlayer.player_wyid == source_id).all()
            results = wyMatchPlayerSchema.dump(query, many=True).data
        else:
            query = JSONPassesMatchPlayer.query.filter(JSONPassesMatchPlayer.match_instatid.in_(dict['match_source_ids'])) \
                                              .filter(JSONPassesMatchPlayer.player_instatid == source_id).all()
            results = matchPlayerSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getPlayerPassesForTeamAndMatch(source, team_source_id, match_source_id):
        if source == "wyscout":
            query = JSONWyPassesMatchPlayer.query.filter(JSONWyPassesMatchPlayer.match_wyid == match_source_id) \
                                      .filter(JSONWyPassesMatchPlayer.team_wyid == team_source_id).all()
            results = wyMatchPlayerSchema.dump(query, many=True).data
        else:
            query = JSONPassesMatchPlayer.query.filter(JSONPassesMatchPlayer.match_instatid == match_source_id) \
                                      .filter(JSONPassesMatchPlayer.team_instatid == team_source_id).all()
            results = matchPlayerSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)


    @staticmethod
    def getPlayerPassesForTeamAndLeague(source, player_source_id, team_source_id, league_source_id):
        if source == "wyscout":
            query = JSONWyPassesMatchPlayer.query \
                    .filter(JSONWyPassesMatchPlayer.team_wyid == team_source_id) \
                    .filter(JSONWyPassesMatchPlayer.league_wyid == league_source_id) \
                    .filter(JSONWyPassesMatchPlayer.player_wyid == player_source_id).all()
            results = wyMatchPlayerSchema.dump(query, many=True).data
        else:
            query = JSONPassesMatchPlayer.query \
                    .filter(JSONPassesMatchPlayer.team_instatid == team_source_id) \
                    .filter(JSONPassesMatchPlayer.league_instatid == league_source_id) \
                    .filter(JSONPassesMatchPlayer.player_instatid == player_source_id).all()
            results = matchPlayerSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getTeamPassesForLeagueAndSeason(source, team_source_id, league_source_id, season):
        if source == "wyscout":
            query = JSONWyPassesMatchTeam.query \
                    .filter(JSONWyPassesMatchTeam.team_wyid == team_source_id) \
                    .filter(JSONWyPassesMatchTeam.league_wyid == league_source_id) \
                    .filter(JSONWyPassesMatchTeam.season == season).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        else:
            query = JSONPassesMatchTeam.query \
                    .filter(JSONPassesMatchTeam.team_instatid == team_source_id) \
                    .filter(JSONPassesMatchTeam.league_instatid == league_source_id) \
                    .filter(JSONPassesMatchTeam.season == season).all()
            results = matchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getPlayerPassesForMatch(source, player_source_id, match_source_id):
        if source == "wyscout":
            query = JSONWyPassesMatchPlayer.query \
                    .filter(JSONWyPassesMatchPlayer.match_wyid == match_source_id) \
                    .filter(JSONWyPassesMatchPlayer.player_wyid == player_source_id).all()
            results = wyMatchPlayerSchema.dump(query, many=True).data
        else:
            query = JSONPassesMatchPlayer.query \
                    .filter(JSONPassesMatchPlayer.match_instatid == match_source_id) \
                    .filter(JSONPassesMatchPlayer.player_instatid == player_source_id).all()
            results = matchPlayerSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getTeamPassesForMatch(source, team_source_id, match_source_id):
        if source == "wyscout":
            query = JSONWyPassesMatchTeam.query \
                    .filter(JSONWyPassesMatchTeam.match_wyid == match_source_id) \
                    .filter(JSONWyPassesMatchTeam.team_wyid == team_source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        else:
            query = JSONPassesMatchTeam.query \
                    .filter(JSONPassesMatchTeam.match_instatid == match_source_id) \
                    .filter(JSONPassesMatchTeam.team_instatid == team_source_id).all()
            results = teamPassesSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)


    @staticmethod
    def getTeamPassesZonesForMatch(source, team_source_id, match_source_id):
        if source == "wyscout":
            query = JSONWyPassesZonesMatchTeam.query \
                    .filter(JSONWyPassesZonesMatchTeam.match_wyid == match_source_id) \
                    .filter(JSONWyPassesZonesMatchTeam.team_wyid == team_source_id).all()
            results = wyMatchTeamSchema.dump(query, many=True).data
        else:
            query = JSONPassesZonesMatchTeam.query \
                    .filter(JSONPassesZonesMatchTeam.match_instatid == match_source_id) \
                    .filter(JSONPassesZonesMatchTeam.team_instatid == team_source_id).all()
            results = teamPassesSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getChancesJSONForMatch(match_source_and_id):
        source, source_id = process_source_and_id(match_source_and_id)
        query = JSONChancesMatchTeam.query \
            .filter(JSONChancesMatchTeam.match_instatid == source_id)
        results = matchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getChancesForTeamAndMatches(team_source_and_id):
        source, source_id = process_source_and_id(team_source_and_id)
        raw_dict = request.get_json(force=True)
        dict = raw_dict['data']
        query = JSONChancesMatchTeam.query.filter(JSONChancesMatchTeam.match_instatid.in_(dict['match_source_ids'])) \
                                  .filter(JSONChancesMatchTeam.team_instatid == source_id).all()
        results = matchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getChancesJSONForPlayer(player_source_and_id):
        source, source_id = process_source_and_id(player_source_and_id)
        query = JSONChancesSeasonPlayer.query \
            .filter(JSONChancesSeasonPlayer.player_instatid == source_id)
        results = seasonPlayerSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getChancesForTeamLeagueAndSeason(source, team_source_id, league_source_id, season):
        query = JSONChancesMatchTeam.query\
            .filter(JSONChancesMatchTeam.season == season)\
            .filter(JSONChancesMatchTeam.league_instatid == league_source_id) \
            .filter(JSONChancesMatchTeam.team_instatid == team_source_id).all()
        results = matchTeamSchema.dump(query, many=True).data
        agg_results = {}
        all_chances = []
        for index, x in enumerate(results['data']):
            match = x['attributes']
            chances = json.loads(match['json'])
            all_chances.extend(chances)
            if index == 0:
                agg_results['season'] = match['season']
                agg_results['team_source_id'] = match['team_instatid']
                agg_results['league_source_id'] = match['league_instatid']
        agg_results['chances'] = all_chances
        return json.dumps({'data': agg_results}, default=decimal_default)

    @staticmethod
    def getChallengesJSONForMatch(match_source_and_id):
        source, source_id = process_source_and_id(match_source_and_id)
        query = JSONChallengesMatchTeam.query\
            .filter(JSONChallengesMatchTeam.match_instatid == source_id)
        results = matchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getChallengesForTeamAndMatches(team_source_and_id):
        source, source_id = process_source_and_id(team_source_and_id)
        raw_dict = request.get_json(force=True)
        dict = raw_dict['data']
        query = JSONChallengesMatchTeam.query.filter(JSONChallengesMatchTeam.match_instatid.in_(dict['match_source_ids'])) \
                                  .filter(JSONChallengesMatchTeam.team_instatid == source_id).all()
        results = matchTeamSchema.dump(query, many=True).data
        results = process_source_ids(results, source)
        return json.dumps(results, default=decimal_default)

    @staticmethod
    def getChallengesForTeamLeagueAndSeason(source, team_source_id, league_source_id, season):
        query = JSONChallengesMatchTeam.query\
            .filter(JSONChallengesMatchTeam.season == season)\
            .filter(JSONChallengesMatchTeam.league_instatid == league_source_id) \
            .filter(JSONChallengesMatchTeam.team_instatid == team_source_id).all()
        results = matchTeamSchema.dump(query, many=True).data
        agg_results = {}
        all_defensive = []
        for index, x in enumerate(results['data']):
            match = x['attributes']
            defensive = json.loads(match['json'])
            all_defensive.extend(defensive)
            if index == 0:
                agg_results['season'] = match['season']
                agg_results['team_source_id'] = match['team_instatid']
                agg_results['league_source_id'] = match['league_instatid']
        agg_results['defensive'] = all_defensive
        return json.dumps({'data': agg_results}, default=decimal_default)
