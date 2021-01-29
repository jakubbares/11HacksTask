import * as d3 from "d3";

export function challengeTypeToSymbol(type: string) {
  switch (type) {
    case "Fouls": return d3.symbolCross;
    case "Challenges": return d3.symbolCircle;
    case "Tackles": return d3.symbolSquare;
    case "Interceptions": return d3.symbolDiamond;
    case "Air challenges": return d3.symbolTriangle;
    default: return null;
  }
}

export const getColorByxG = d3.scaleLinear<string, number>()
  .domain(<Array<number>>[0, 0.1, 0.3])
  .range(<ReadonlyArray<string>>['blue', 'lightyellow', 'red']);

export function borderColor(print) {
  return print ? "black" : "white";
}

export function passTypes(source: string) {
  return source === "wyscout" ?
    ["Key pass", "Progressive pass", "Smart pass", "Long pass", "Cross", "Shot assist", "Second assist", "Third assist", "Pass"] :
    ["Passes", "Key passes", "Assists"]
}

export function getColorByPassType(print) {
  return function (type) {
    switch (type) {
      case "Assists": return "red";
      case "Shot assist": return "red";
      case "Second assist": return "pink";
      case "Third assist": return "pink";
      case "Passes": return print ? "white" : "black";
      case "Pass": return print ? "white" : "black";
      case "Key passes": return "blue";
      case "Key pass": return "blue";
      case "Long pass": return "green";
      case "Cross": return "lightgreen";
      case "Smart pass": return "purple";
      case "Progressive pass": return "lightblue";
    }
  }
}

export function getColorByAssistType(print, type) {
  switch (type) {
    case "pass": return print ? "white" : "black";
    case "throw_in": return print ? "lightgreen" :"green";
    case "corner": return print ? "lightblue" : "blue";
    case "free_kick": return print ? "orange" : "red";
  }
}

export function getStrokeDashArrayByAssistType(type) {
  switch (type) {
    case "pass": return 0;
    case "throw_in": return 3;
    case "corner": return 3;
    case "free_kick": return 0;
  }
}

export function getNone(type) {
  return "none"
}

export function getColorByShotResultWithPrint(print: boolean) {
  return function(result) {
    switch (result) {
      case 'own_goal': return print ? "#FA6539" : 'black';
      case 'goal': return print ?  "#6BCAB0": 'red';
      case 'saved': return print ? "#6B33E1" : 'blue';
      case 'off_target': return  print ? "#E37E76" : '#00BFFF';
      case 'blocked': return print ? "#EFDE67" : 'grey';
      default: return print ? "white" : "black";
    }
  }
}

export function getStrokeByShotResultWithPars(result: string, pars) {
  const { symbolEdgeWidth } = pars;
  switch (result) {
    case 'own_goal': return  symbolEdgeWidth;
    case 'goal': return symbolEdgeWidth;
    case 'saved': return symbolEdgeWidth;
    case 'off_target': symbolEdgeWidth * 0.75;
    case 'blocked': symbolEdgeWidth * 0.75;
    default: return symbolEdgeWidth;
  }
}

export function getSymbolByShotType(type) {
  switch (type) {
    case 'free_kick': return d3.symbolSquare;
    case 'header': return d3.symbolCircle;
    case 'head_or_other': return d3.symbolCircle;
    case 'foot/other': return d3.symbolTriangle;
    case 'left_foot': return d3.symbolTriangle;
    case 'right_foot': return d3.symbolTriangle;
    case 'assist': return d3.symbolTriangle;
    case 'dribble': return d3.symbolDiamond;
    case 'penalty': return d3.symbolDiamond;
    default: return d3.symbolWye;
  }
}

export function colorConditionFunction(averageStats) {
  return function (row, field, position=null) {
    const value = position === null ? averageStats[field] : averageStats[position][field];
    if (['birthday', 'height', 'weight', 'left_foot', 'right_foot', 'score'].includes(field)) {
      return '#283142'
    } else if (!value || row[field] < value * 0.3) {
      return 'scale-1'
    } else if (row[field] < value * 0.6) {
      return 'scale-2'
    } else if (row[field] < value * 0.85) {
      return 'scale-3'
    } else if (row[field] < value * 1.15) {
      return 'scale-4'
    } else if (row[field] < value * 1.4) {
      return 'scale-5'
    } else if (row[field] < value * 1.7) {
      return 'scale-6'
    } else if (row[field] >= value * 1.7) {
      return 'scale-7'
      // return ['yellow_cards', 'red_cards', 'fouls', 'lost_balls_p90'].includes(field) ? 'worse' : 'better'
    } else {
      return '#283142'
    }
  }
}


export function colorZones(zone) {
  const fill = d3.scaleLinear<string, number>()
    .domain([0, 4, 8])
    .range(["#36033B", "#CED7D9", "#A48942"]);
  const count = this.zoneCounts[zone];
  const value = (count - this.averageCount) / this.averageCount;
  if (value < -0.8 || count == undefined) {
    return fill(0)
  } else if (value < -0.2) {
    return fill(1)
  } else if (value < 0.3) {
    return fill(2)
  } else if (value < 0.1) {
    return fill(3)
  } else if (value < 0.5) {
    return fill(4)
  } else if (value < 1) {
    return fill(5)
  } else if (value < 2.1) {
    return fill(6)
  } else if (value < 2.8) {
    return fill(7)
  } else if (value => 2.8) {
    return fill(8)
  }
}
