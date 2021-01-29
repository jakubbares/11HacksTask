#!/usr/bin/env python
from app import create_app

from datetime import datetime
from app.data.views.charts import ChartsList
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
    return ChartsList.getFilters()


if __name__ == '__main__':
    app.run(host=app.config['HOST'],
            port=app.config['PORT'],
            debug=app.config['DEBUG'])
