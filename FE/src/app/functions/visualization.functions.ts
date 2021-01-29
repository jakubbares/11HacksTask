import {ChartParameters, Coors, FieldType, LegendItem, Margin} from "../models/models";
import * as d3 from "d3";
import {fieldDimensions, fieldSize} from "./field.functions";

export function  offsetAdjusting(position, text) {
  const textLength = text.length * 3 + 50;
  return position > textLength ? position : textLength;
}




export function standardParameters(type: FieldType): ChartParameters {
  const margin: Margin = {left: 0, top: 0, right: 200, bottom: 0};
  const {width, height} = fieldSize(type);
  return {
    divId: "chart",
    id: "chart-svg",
    margin: margin,
    width: width,
    height: height,
    fullWidth: width + margin.left + margin.right,
    fullHeight: height + margin.top + margin.bottom,
    borderCoeffficient: 1.35,
    borderColor: "white",
    lineStrokeWidth: 3.5,
    lineOpacity: 1,
    legendItemWidth: 150,
    legendItemHeight: 20,
    legendSymbolSize: 90,
    legendTopLeftPosition: {x: width + 45, y: 30},
    nextLegendHorizontalOffset: 100,
    nextLegendVerticalOffset: 23.5,
    symbolSize: 60,
    symbolOpacity: 0.6,
    symbolEdgeWidth: 5,
    legendEdgeWidth: 1.5,
    logoFrameWidth: width
  }
}

export function switchCoordidates(data: any[], fromFormat="_from", toFormat= "_to") {
  const coordinates = [fromFormat, toFormat];
  return data.map(pass => {
    coordinates.forEach(ending => {
      const inter = pass["x"+ending];
      pass["x"+ending] = pass["y"+ending];
      pass["y"+ending] = inter;
    });
    return pass;
  });
}

export function createTooltip(pars: ChartParameters) {
  return d3.select(pars.divId).append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.5);
}

export function createSvg(pars: ChartParameters) {
  return d3.select('#'+pars.divId).append('svg')
    .attr("id", pars.id)
    .attr("width", pars.fullWidth)
    .attr("height", pars.fullHeight)
    .append("g")
    .attr("transform", "translate(" + pars.margin.left + "," + pars.margin.top + ")");
}

export function createScales(type: FieldType, pars: ChartParameters, scale=d3.scaleLinear()) {
  const dims = fieldDimensions(type);
  const x = d3.scaleLinear<number, number>().range(<ReadonlyArray<number>>[0, pars.width]);
  const y = d3.scaleLinear<number, number>().range(<ReadonlyArray<number>>[pars.height, 0]);
  x.domain(fieldDimensions(type).x);
  y.domain(fieldDimensions(type).y);

  return {x, y};
}

export function createCoors(point) {
  return {x: point[0], y: point[1]};
}

export function testPoints() {
  const points = [[0, 0], [0, 68], [105, 0], [105, 68], [105/2, 0], [105/2, 68]];
  return points.map(point => {
    return createCoors(point);
  });
}

export function tooltipFn(tooltip, html) {
  return function () {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(html)
      .style("right", (100) + "px")
      .style("top", (30) + "px");
  }
}

export function addMarkers(svg, colors: string[], width=12) {
  colors.push("black", "white");
  colors.forEach(color => {
    const ref =  ["black", "white"].includes(color) ? 6 : 6;
    width = ["black", "white"].includes(color) ? width * 0.925 : width;
    svg.append("defs")
      .append("marker")
      .attr("id", `${color}-arrow`)
      .attr("viewBox", "0 0 12 12")
      .attr("refX", ref)
      .attr("refY", ref)
      .attr("markerWidth", width)
      .attr("markerHeight", width)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
      .attr("fill", color);
  });
}

export function createLine(svg, that, pars: ChartParameters, coors: Coors, color, strokeDashArray=0, withMarketEnd=true, withBorder=true) {
  if (withBorder) {
    svg.append("line")
      .attr("x1", coors.x)
      .attr("y1", coors.y)
      .attr("x2", coors.x_to)
      .attr("y2", coors.y_to)
      .attr("stroke", pars.borderColor)
      .style("stroke-dasharray", strokeDashArray)
      .attr("stroke-width", pars.lineStrokeWidth * pars.borderCoeffficient)
      .attr("marker-end", withMarketEnd ? "url(#" + pars.borderColor + "-arrow)" : "none")
      .attr("opacity", pars.lineOpacity);
  }
  const line = svg.append("line")
    .attr("x1", coors.x)
    .attr("y1", coors.y)
    .attr("x2", coors.x_to)
    .attr("y2", coors.y_to)
    .attr("stroke", color)
    .style("stroke-dasharray", strokeDashArray)
    .attr("stroke-width", pars.lineStrokeWidth)
    .attr("marker-end", withMarketEnd ? "url(#" + color + "-arrow)" : "none")
    .attr("opacity", pars.lineOpacity);
  console.log(color, line)
}

export function createCircle(svg, that, d, pars: ChartParameters, coors: Coors, color: string, tooltip, tooltipFn, withBorder=true) {
  if (withBorder) {
    svg.append("circle")
      .attr("cx", coors.x)
      .attr("cy", coors.y)
      .attr("r", pars.circleRadius * pars.borderCoeffficient)
      .attr("fill", pars.borderColor)
  }
  svg.append("circle")
    .attr("cx", coors.x)
    .attr("cy", coors.y)
    .attr("r", pars.circleRadius)
    .attr("fill", color)
    .style("cursor", "pointer")
    .on("mouseover", tooltipFn)
    .on("mouseout", function() {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .on("dblclick", () => {
      that.toBeRemoved.push(d);
      that.render();
    });
}

export function createTestPoints(svg, x, y) {
  const points = testPoints();
  const side = createCoors([105/4*3, 68/4*3]);
  svg.append("circle")
    .attr("cx", x(side.x))
    .attr("cy", y(side.y))
    .attr("r", 40)
    .attr("fill", "blue");

  points.forEach(coors => {
    console.log(coors, x(coors.x), y(coors.y))
    svg.append("circle")
      .attr("cx", x(coors.x))
      .attr("cy", y(coors.y))
      .attr("r", 15)
      .attr("fill", "red")

    svg.append("circle")
      .attr("cx", x(coors.x))
      .attr("cy", y(coors.y))
      .attr("r", 3)
      .attr("fill", "black")
  });
}

export function generateLegend(svg, print, pars: ChartParameters, types: string[], strokeColorFn, fillColorFn=null, symbolFn=null, numberOfItemsBefore=0, order=1, withResults=true) {
  const typeItems = types.map((type: string, index) => {
    const x = pars.legendTopLeftPosition.x;
    let y = pars.legendTopLeftPosition.y + index * pars.legendItemHeight * 1.27;
    y += numberOfItemsBefore ? numberOfItemsBefore * pars.legendItemHeight * 1.27 + (order - 1) * pars.nextLegendVerticalOffset : 0;
    const symbol = symbolFn ? symbolFn(type) : d3.symbolCircle;
    fillColorFn = fillColorFn ? fillColorFn : strokeColorFn;
    return new LegendItem(type, x, y, symbol, strokeColorFn(type), fillColorFn(type));
  });

  const results = ["Successful", "Unsuccessful"];
  const resultItems = results.map((type: string, index) => {
    const x = pars.legendTopLeftPosition.x;
    const y = pars.legendTopLeftPosition.y +
      (types.length + index) * 1.27 * pars.legendItemHeight + pars.nextLegendVerticalOffset;
    return new LegendItem(type, x, y, d3.symbolCircle, print ? "white" : "grey", "none");
  });

  return [typeItems, resultItems];
}

export function createLegend(svg, legendItems: LegendItem[], pars: ChartParameters, that, className, withText=true) {
  const textRelativeHorizontalPosition = 30;
  const textRelativeVerticalPosition = 5;
  // Handmade legend
  svg.selectAll(`.${className}`)
    .data(legendItems)
    .enter().append("path")
    .attr("d", d3.symbol().size(pars.legendSymbolSize).type(function (d: LegendItem) {
      return d.symbol
    }))
    .style("stroke-dasharray", function (d: LegendItem) { return d.strokeDashArray })
    .style("stroke-width", 1.5)
    .style('stroke', function (d: LegendItem) { return d.strokeColor})
    .style('fill', function (d: LegendItem) { return d.fillColor})
    .attr("transform", function (d: LegendItem) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  if (withText) {
    svg.selectAll(`.${className}Text`)
      .data(legendItems)
      .enter()
      .append("text")
      .attr("x", function (d: LegendItem) { return d.x + textRelativeHorizontalPosition })
      .attr("y", function (d: LegendItem) { return d.y + textRelativeVerticalPosition })
      .text(function (d: LegendItem) { return that.print ? that.trans.translate(d.type).toUpperCase() : d.type })
      .style("fill", that.print ? 'white' : 'black')
      .style("font-size", "15px")
      .style("font-family", "DecisoRegularItalic")
      .attr("alignment-baseline", "left")
  }
}


export function findLineByLeastSquares(xValues, yValues) {
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let count = 0;

  let x = 0;
  let y = 0;
  const valuesLength = xValues.length;

  if (valuesLength === 0) {
    return [];
  }

  for (let i = 0; i < valuesLength; i++) {
    x = xValues[i];
    y = yValues[i];
    sum_x += x;
    sum_y += y;
    sum_xx += x * x;
    sum_xy += x * y;
    count++;
  }

  const m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
  const b = (sum_y / count) - (m * sum_x) / count;

  const results = [];

  for (let i = 0; i < valuesLength; i++) {
    x = xValues[i];
    y = x * m + b;
    results.push({x, y});
  }

  return results;
}

