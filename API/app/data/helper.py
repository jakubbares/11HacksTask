import re
import numpy as np
import pickle
import math
import pathlib
import pandas as pd
from sqlalchemy.sql.functions import ReturnTypeFromArgs


def weighted_average(value1, value2, count1, count2):
    sum = value1 * count1 + value2 * count2
    return sum / count1 + count2

def process_source_and_id(source_and_id):
    letters_match = re.match('[a-z]+', source_and_id)
    letters = letters_match.group(0) if letters_match else "instat"
    split = source_and_id.split(letters)
    numbers = split[1] if len(split) >= 2 else split[0]
    return letters, int(numbers)

def process_source_ids(results, source, without_data=False):
    processed = []
    to_process = results if without_data else results['data']
    for result in to_process:
        result['attributes']['source'] = source
        if 'wyid' in result['attributes']:
            result['attributes']['source_id'] = result['attributes']['wyid']
        if 'player_wyid' in result['attributes']:
            result['attributes']['player_source_id'] = result['attributes']['player_wyid']
        if 'league_wyid' in result['attributes']:
            result['attributes']['league_source_id'] = result['attributes']['league_wyid']
        if 'match_wyid' in result['attributes']:
            result['attributes']['match_source_id'] = result['attributes']['match_wyid']
        if 'team_wyid' in result['attributes']:
            result['attributes']['team_source_id'] = result['attributes']['team_wyid']
        if 'other_team_wyid' in result['attributes']:
            result['attributes']['other_team_source_id'] = result['attributes']['other_team_wyid']
        if 'guest_team_wyid' in result['attributes']:
            result['attributes']['guest_team_source_id'] = result['attributes']['guest_team_wyid']
        if 'home_team_wyid' in result['attributes']:
            result['attributes']['home_team_source_id'] = result['attributes']['home_team_wyid']

        if 'instatid' in result['attributes']:
            result['attributes']['source_id'] = result['attributes']['instatid']
        if 'player_instatid' in result['attributes']:
            result['attributes']['player_source_id'] = result['attributes']['player_instatid']
        if 'league_instatid' in result['attributes']:
            result['attributes']['league_source_id'] = result['attributes']['league_instatid']
        if 'match_instatid' in result['attributes']:
            result['attributes']['match_source_id'] = result['attributes']['match_instatid']
        if 'team_instatid' in result['attributes']:
            result['attributes']['team_source_id'] = result['attributes']['team_instatid']
        if 'other_team_instatid' in result['attributes']:
            result['attributes']['other_team_source_id'] = result['attributes']['other_team_instatid']
        if 'guest_team_instatid' in result['attributes']:
            result['attributes']['guest_team_source_id'] = result['attributes']['guest_team_instatid']
        if 'home_team_instatid' in result['attributes']:
            result['attributes']['home_team_source_id'] = result['attributes']['home_team_instatid']
        processed.append(result)
    return processed if without_data else {'data': processed}

def count_cluster_instances(passes):
    inputs = np.array([[x['px'], x['py'], x['target_px'], x['target_py'],
                        math.atan2(x['target_py'] - x['py'], x['target_px'] - x['px'])] for x in passes
                       if abs(int(x['py']) - int(x['target_py'])) < 40
                       and abs(int(x['px']) - int(x['target_px'])) < 65
                       ])
    model = pickle.load(open(pathlib.Path(__file__).parent / 'kmeans_passes_60_angle.sav', 'rb'))
    indexes = model.predict(inputs)
    passesClassified = [{'center': model.cluster_centers_[ix], 'index': ix,
                         'pass': {'px': ip[0], 'py': ip[1], 'target_px': ip[2], 'target_py': ip[3]}} for ix, ip in zip(indexes, inputs)]
    passesClassified = [{'index': x['index'], 'px': x['center'][0], 'py': x['center'][1], 'target_px': x['center'][2],
                         'target_py': x['center'][3], 'angle': x['center'][4] * 2 * math.pi, "pass": x['pass']} for x in passesClassified]
    df = pd.DataFrame(passesClassified).groupby(['index', 'px', 'py', 'target_px', 'target_py', 'angle']).size()
    results = [{'index': key[0], 'px': key[1], 'py': key[2], 'target_px': key[3], 'target_py': key[4],
                'angle': key[5], 'count': value, 'passes': [x['pass'] for x in passesClassified if x['index'] == key[0]]} for key, value in df.items()]
    return results


def extract_min_max_season(seasons):
    seasons = [season for season in seasons if len(season) == 9]
    if len(seasons) == 0:
        return "Mix"
    min_season = min(seasons)
    max_season = max(seasons)
    return f"{min_season[0:4]}-{max_season[5:9]}"


def is_number(value):
    return isinstance(value, float) or isinstance(value, int)
