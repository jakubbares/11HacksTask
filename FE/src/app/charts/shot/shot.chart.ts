import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import {MatchService} from '../../services/match.service';
import {ChartService} from '../../services/chart.service';
import {PitchService} from '../../services/pitch.service';
import {symbolHexagon} from 'd3-symbol-extra';
import {capitalizeField} from '../../functions/shared.functions';
import * as _ from 'lodash';
import {TranslationService} from "../../services/translation.service";
import {Store} from "../../services/store";
import {distinct, distinctUntilChanged, first} from "rxjs/operators";
import {ChartParameters, Coors, League, Match, Player, Season, Team} from "../../models/models";
import {dateFromSQL, parseTime} from 'app/functions/date.functions';
import {extractFieldValues} from "../../functions/extract.functions";
import {
  createCircle,
  createLegend, createLine, createScales,
  createSvg, createTestPoints,
  generateLegend,
  standardParameters, tooltipFn
} from "../../functions/visualization.functions";
import {
  getColorByAssistType,
  getColorByShotResultWithPrint, getColorByxG,
  getNone, getStrokeDashArrayByAssistType,
  getSymbolByShotType
} from "../../functions/color.functions";
import {filterVisualData} from "../../functions/data.functions";


@Component({
  selector: 'eh-shot-chart',
  templateUrl: 'shot.chart.html',
  styleUrls: ['shot.chart.scss']
})
export class ShotChart implements AfterViewInit, OnChanges {
  @Input() match: Match;
  @Input() club: Team;
  @Input() player: Player;
  @Input() season: Season;
  @Input() league: League;
  @ViewChild('field') fieldDiv: ElementRef;
  data: any[];
  pars: ChartParameters;
  margin_top = 0;
  players: any[] = [];
  teams: any[] = [];
  xGTypes = ['0', '0.05', '0.1', '0.15', '0.2', '0.25', '0.3+'];
  resultTypes = ['goal', 'saved', 'off_target', 'blocked', 'own_goal'];
  xGOn = [];
  resultsOn = [];
  shotsOn = [];
  playersOn = [];
  teamsOn = [];
  printStats = {};
  print = false;
  dateFromSQL = dateFromSQL;
  triggered = 0;
  showAssists = true;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.print = !this.print;
    this.render()
  }

  constructor(
    private pitchService: PitchService,
    private trans: TranslationService,
    private matchService: MatchService,
    public store: Store,
    private chartService: ChartService) {
    window['shot'] = this;
    this.pars = {
      ...standardParameters("penalty"),
      symbolSize: 255,
      legendSymbolSize: 225,
      lineStrokeWidth: 0.95,
      lineOpacity: 0.75,
      symbolEdgeWidth: 4,
      symbolOpacity: 0.7,
      borderColor: this.print ? "white" : "black",
    };
  }

  ngOnChanges() {
    this.getShots();
  }

  ngAfterViewInit() {
    this.store.matchesChanged.pipe(distinctUntilChanged()).subscribe(next => {
      this.getShots();
    });
  }

  get legend() {
    return {
      shotType: {
        top:  this.pars.legendTopLeftPosition.y - 10
      },
      result: {
        top: this.pars.legendTopLeftPosition.y - 10 +
          this.shotTypes.length * this.pars.legendItemHeight * 1.27 + this.pars.nextLegendVerticalOffset
      },
      xG: {
        top: this.pars.legendTopLeftPosition.y - 10 +
          (this.shotTypes.length + this.resultTypes.length) * this.pars.legendItemHeight
          * 1.27 + 2 * this.pars.nextLegendVerticalOffset
      },
      showAssistsSwitch: {
        top: this.pars.legendTopLeftPosition.y - 10 +
          (this.shotTypes.length + this.resultTypes.length + this.xGTypes.length) * this.pars.legendItemHeight
          * 1.27 + 3 * this.pars.nextLegendVerticalOffset
      }
    }
  }

  get shotTypes() {
    const wyscout = ["free_kick", "left_foot",  "right_foot", "head_or_other", "penalty"];
    const instat = ['free_kick', 'foot/other'];
    return this.store.source === "wyscout" ? wyscout : instat;
  }

  resultToStroke (result) {
    const { symbolEdgeWidth } = this.pars;
    switch (result) {
      case 'own_goal': return {edge: this.print ? "#FA6539" : 'black', symbolEdgeWidth, opacity: 1, fill: 'black'};
      case 'goal': return {edge: this.print ?  "#6BCAB0": 'red', symbolEdgeWidth, opacity: 1, fill: 'dynamic'};
      case 'saved': return {edge: this.print ? "#6B33E1" : 'blue', symbolEdgeWidth, opacity: this.pars.symbolOpacity, fill: 'dynamic'};
      case 'off_target': return {edge: this.print ? "#E37E76" : '#00BFFF', edgeWidth: symbolEdgeWidth * 0.75, opacity: this.pars.symbolOpacity, fill: 'dynamic'};
      case 'blocked': return {edge: this.print ? "#EFDE67" : 'grey', symbolEdgeWidth: symbolEdgeWidth * 0.75, opacity: this.pars.symbolOpacity, fill: 'dynamic'};
      default: return {edge: 'none', symbolEdgeWidth, opacity: this.pars.symbolOpacity, fill: 'dynamic'};
    }
  }

  toggleShowAssists() {
    this.showAssists = !this.showAssists;
    this.render();
  }

  switchOnOff(type, on, value) {
    if (on) {
      this[type + 'On'].push(value);
    } else {
      const index = this[type + 'On'].indexOf(value);
      this[type + 'On'].splice(index, 1);
    }
    this.render();
  }

  getShots() {
    if (new Date().getTime() <= (this.triggered + 100))
      return;
    this.triggered = new Date().getTime();
    if (this.match) {
      this.margin_top = 105;
      this.chartService.getShotsForMatch(this.match.source + this.match.match_source_id, (data) => {
        data = data.find(d => d.team_source_id == this.club.source_id);
        this.data = data ? data.items : [];
        this.render();
      });
    } else if (this.player) {
      this.chartService.getShotsForPlayer(this.player.source + this.player.source_id, (data) => {
        data = data.find(d => d.season === this.season.season && d.team_source_id === this.club.source_id);
        this.data = data ? data.items : [];
        this.render();
      });
    } else if (this.club && this.store.showMatchStats) {
      const matches = this.store.matches.chosen.map(m => m.source_id);
      if (this.store.against) {
        this.chartService.getShotsAgainstForTeamAndMatches(this.club.source + this.club.source_id, matches, (data) => {
          const flatten = (array) => array.reduce((arr, item) => {
            arr.push(...item.items);
            return arr;
          }, []);
          this.data = data ? flatten(data) : [];
          this.render();
        });
      } else {
        this.chartService.getShotsForTeamAndMatches(this.club.source + this.club.source_id, matches, (data) => {
          const flatten = (array) => array.reduce((arr, item) => {
            arr.push(...item.items);
            return arr;
          }, []);
          this.data = data ? flatten(data) : [];
          this.render();
        });
      }
    } else if (this.club) {
      if (this.store.against) {
        this.chartService.getShotsAgainstForTeamLeagueAndSeason(this.club.source, this.club.source_id, this.league.source_id, this.season.season, (data) => {
          this.data = data.items;
          this.render();
        });
      } else {
        this.chartService.getShotsForTeamLeagueAndSeason(this.club.source, this.club.source_id, this.league.source_id, this.season.season, (data) => {
          this.data = data.items;
          this.render();
        });
      }
    }
  }

  render() {
    console.log(this.data)
    const that = this;
    this.players = extractFieldValues(this.data, 'player_name');
    this.teams = extractFieldValues(this.data, 'team_name');
    const data = filterVisualData(this);
    this.data.filter(d => {
      this.printStats[d.player_name] = {totalShots: 0, totalXG: 0, totalGoals: 0};
    });
    console.log(data.filter(d => d.assist_x < 60));
    data.forEach(x => {
      if (['header', 'assist', 'dribble'].includes(x.type)) x.type = 'foot/other';
      if (x.result === "own_goal") x.x = 105 - x.x;
      this.printStats[x.player_name].totalShots += 1;
      this.printStats[x.player_name].totalGoals += x.result === 'goal' ? 1 : 0;
    }, {});

    d3.select('#' + that.pars.id).remove();
    this.pitchService.renderFieldShots(this.fieldDiv, this.print);

    const {x, y} = createScales("penalty", that.pars);
    const svg = createSvg(that.pars);

    const tooltip = d3.select(that.pars.divId).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0.3);

    if (this.club.source === "wyscout" && this.showAssists) {
      data.filter(shot => shot.assist_type).forEach(function (d) {
        const coors: Coors = {
          x: x(d.assist_y),
          y: y(d.assist_x),
          x_to: x(d.y),
          y_to: y(d.x)
        };
        const color = getColorByAssistType(that.print, d.assist_type);
        const strokeDashArray = getStrokeDashArrayByAssistType(d.assist_type);
        createLine(svg, that, that.pars, coors, color, strokeDashArray, false);
      });
    }

    svg.selectAll('.point')
      .data(data)
      .enter().append('path')
      .attr('d', d3.symbol().size(that.pars.symbolSize).type(function (d: any) {
        return getSymbolByShotType(d.type)
      }))
      .attr('transform', function (d: any) {
        return 'translate(' + x(d.y) + ',' + y(d.x) + ')';
      })
      .attr('fill-opacity', function (d) {
        return that.resultToStroke(d.result).opacity
      })
      .style('fill', function (d) {
        const color = that.resultToStroke(d.result).fill;
        return color === 'dynamic' ? getColorByxG(d.xG) : color;
      })
      .style('stroke', function (d) {
        return that.resultToStroke(d.result).edge
      })
      .attr('stroke-width', function (d) {
        return that.resultToStroke(d.result).symbolEdgeWidth
      })
      .on('mouseover', function (d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html('Time: ' + parseTime(d.time))
          .style('right', 0 + 'px')
          .style('top', 500 + 'px');
      })
      .on('mouseout', function (d) {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const xgFillFn = (type) => getColorByxG(parseFloat(type));
    let [shotTypeItems, _] = generateLegend(svg, that.print, that.pars, that.shotTypes, (type) => that.print ? "white" : "black", getNone, getSymbolByShotType);
    createLegend(svg, shotTypeItems, that.pars, that, "shotTypes");
    let [resultTypeItems, __] = generateLegend(svg, that.print, that.pars, that.resultTypes, getColorByShotResultWithPrint(that.print), getColorByShotResultWithPrint(that.print), null,
      that.shotTypes.length, 2);
    createLegend(svg, resultTypeItems, that.pars, that, "resultTypes");
    let [xGTypeItems, ___] = generateLegend(svg, that.print, that.pars, that.xGTypes, (type) => that.print ? "white" : "black", xgFillFn, (type) => symbolHexagon,
      that.shotTypes.length + that.resultTypes.length, 3);
    createLegend(svg, xGTypeItems, that.pars, that, "xGTypes");
  }
}
