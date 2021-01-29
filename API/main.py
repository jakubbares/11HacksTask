#!/usr/bin/env python
from app import create_app

from datetime import datetime
from app.data.views.players import PlayerList
from app.data.views.matchstats import MatchStatsList
from app.data.views.radarstats import RadarStatsList
from app.data.views.groupedstats import GroupedStatsList
from app.data.views.customstats import CustomStatsList
from app.data.views.teams import TeamList, TeamUpdate
from app.data.views.leagues import LeagueList, LeagueUpdate
from app.data.views.positions import PositionList
from app.data.views.teamleague import TeamLeagueLinkList
from app.data.views.tags import PlayerEvaluationList, PlayerEvaluationUpdate
# from app.data.views.transfers import TransferList, TransferUpdate
from app.data.views.matches import MatchList, MatchUpdate
from app.data.views.teamleague import TeamLeagueLink
from app.data.views.playerposition import PlayerPositionLink
from app.data.views.scouting import ScoutingList, ScoutingUpdate
from app.data.views.users import UserList, UserUpdate
from app.data.views.similar import SimilarList
from app.data.views.charts import ChartsList
from app.data.views.filters import FilterList
import flask

import sys, os.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname( __file__ ), 'venv/Lib/site-packages')))


from flask import render_template
from flask import request
app = create_app('config')
from flask_cors import CORS, cross_origin
CORS(app, resources={r"/*": {"origins": "http://www.elevenhacks.com*"}})
import re
from urllib.parse import urlparse

# Scouting
@app.route('/charts/b', methods=['GET'])
def getFilters():
    return FilterList.getFilters()

@app.route('/charts/a', methods=['POST'])
def postFilter():
    return FilterList.postFilter()


if __name__ == '__main__':
    app.run(host=app.config['HOST'],
            port=app.config['PORT'],
            debug=app.config['DEBUG'])
