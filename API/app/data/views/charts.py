from flask import Blueprint, request, jsonify, make_response
from flask_restful import Api, Resource
import json
from sqlalchemy import distinct, func, case
stats = Blueprint('stats', __name__)
import pandas as pd
from app.data import decimal_default


class ChartsList(Resource):
    @staticmethod
    def getShotsForMatchAndTeam():
        results = []
        return json.dumps(results, default=decimal_default)

