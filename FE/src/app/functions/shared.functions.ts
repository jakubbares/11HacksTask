import {firstBy} from 'thenby';
import * as moment from 'moment';
import {Season, PercentileType, League, Team} from '../models/models';
import * as _ from 'lodash';
import {cloneDeep} from "lodash";

export function sourceStyle(source) {
  return source === "wyscout" ? "background-color: lightred" : "background-color: lightblue"
}

export function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function uniqueCounts(array) {
  return array.reduce((acc, btn) => {
    acc[btn] = acc[btn] ? acc[btn] + 1 : 1;
    return acc;
  }, Object.create(null));
}

export function range(max) {
  return _.range(max)
}

export function generatePercentileTypes(): { all: PercentileType[], chosen: PercentileType} {
  const types = ["All", "U19", "U21", "U24"].map(type => {return {type: type}});
  return { all: types, chosen: types[0] };
}


export function processSourceAndId(source_and_id) {
  const letters_match = source_and_id.match('[a-z]+');
  const letters = letters_match ? letters_match[0] : "instat";
  const split = source_and_id.split(letters);
  const  numbers = split.length >= 2 ? split[1] : split[0];
  return {source: letters, source_id: numbers};
}


export function step(max) {
  return max / 500;
}

export const mergeNumeric = (a, b) => {
  return a.map((first, index) => {
    const second = b[index];
    return Object.keys(first).map(key => {
      first[key] = first[key] + second[key]
    })
  });
}



export const matchRoundStartDate = (match_date) => {
  const date = new Date(match_date);
  const day = date.getDay();
  date.setDate(date.getDate() - day + 2);
  return date;
};

export function flatMap(array) {
  return array.reduce((acc, arr) => acc.concat(arr), []);
}

export function unique(array) {
  return Array.from(new Set(array));
}

export function getMinSeasonForPlayer(data: any[]) {
  return data.reduce((minSeasonMap, d) => {
    const previous = minSeasonMap.hasOwnProperty(d.player_source_id) ? minSeasonMap[d.player_source_id] : new Date().getFullYear();
    const minSeason = d.season ? Math.min(d.season.substr(0,4), previous) : null;
    minSeasonMap[d.player_source_id] = minSeason;
    return minSeasonMap;
  }, {});
}



export function getPropertiesFromObject(item, fields) {
  const result = {};
  fields.forEach(field => {
    result[field] = item[field];
  });
  return result;
}

export function distinct(value, index, self) {
  return self.indexOf(value) === index;
}

export function distinctObjects(array, fields) {
  const firstField = fields[0];
  array = array.map(item => getPropertiesFromObject(item, fields));
  return Array.from(new Set(array.map(d => d[firstField]))).map(item => {
    return array.find(obj => obj[firstField] === item)
  })
}

export function filterRowToCustomKeys(row, keys) {
  const object = {};
  keys.forEach(key => {
    object[key] = row[key]
  });
  return object;
}

export function capitalizeField(field) {
  return field ? field[0].toUpperCase() + field.slice(1).replace(/_/g, ' ') : "";
}

export function capitalizeAllWords(field) {
  return field ? field.replace(/_/g, ' ').split(' ').map(x => capitalizeField(x)).join(' ') : "";
}


export function add0IfNecessary(num) {
  const str = num.toString();
  return str.length < 2 ? '0'+str : str;
}

export function repeat(item, times) {
  const arr = [];
  for (var i = 0; i < times; i++) {
    arr.push(item);
  }
  return arr;
}

export function median(data, field: string) {
  const values = data.map(d => d[field]);
  const index = Math.floor(values.length / 2);
  return values[index];
}

export function average(data, field: string) {
  const sum = data.map(d => d[field]).reduce(function(sum, value) {
    return sum + value;
  }, 0);
  return Math.round(sum * 100 / data.length )/100;
}

export function reduceForKey(data: any[], func, key: string, metric: string) {
  const uniqueMap = data.reduce((map, d) => {
    if (map.hasOwnProperty(d[key])) {
      map[d[key]].push(d)
    } else {
      map[d[key]] = []
    }
    return map;
  }, {});
  return Object.keys(uniqueMap).reduce((map, u) => {
    const array = uniqueMap[u].map(d => d[metric]);
    map[u] = func(...array);
    return map;
  }, {});
}



export function scale(x, maxX, length): number {
  return Math.round(x * (length) / maxX);
}

export function round(value, multiplier): number {
  return Math.round(value * (multiplier)) / multiplier;
}

export function max(data: any[], metric: string): number {
  return data.reduce((maximum, d) => {
    maximum = d[metric] > maximum ? d[metric] : maximum
    return maximum;
  }, 0);
}

export function min(data: any[], metric: string): number {
  return data.reduce((maximum, d) => {
    maximum = d[metric] < maximum ? d[metric] : maximum;
    return maximum;
  }, 1000000000000000000000000000);
}


export function means(numbers: number[]) {
  let total = 0, i;
  Object.keys(numbers[0]).reduce((map, metric) => {
    for (i = 0; i < numbers.length; i += 1) {
      total += numbers[i][metric];
    }
    const mean =  total / numbers.length;
    map[metric] = mean;
    return map;
  }, {});
}

export function meanForField(numbers: number[], field: string) {
  let total = 0, i;
  for (i = 0; i < numbers.length; i += 1) {
    total += numbers[i][field];
  }
  return total / numbers.length;
}


export function filterOutliersForField(data, field: string) {
  const med = median(data, field);
  return data.filter(item => {
    return !med || item[field] < med * 100;
  });
}

export function roundComplex(value) {
  if (value) {
    if (typeof value === "number") {
      return Math.round(value * 1000) / 1000;
    } else if (!value.match('-')) {
      return Math.round(parseFloat(value) * 1000) / 1000;
    } else {
      return value;
    }
  }
  return 0;
}

