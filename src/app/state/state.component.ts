import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import apiKey from '../../apiKey';
import * as Plotly from 'plotly.js';
import stateData from '../home/home.component.data';
import getColors from 'get-image-colors';
import path from 'path';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {

  @ViewChild('simplechart') el: ElementRef;

  state: string = this.route.params._value.abbr;
  name: string;
  nameForFile: string;
  totalData: array;
  renewableData: array;
  units: string;
  source: string;
  rankRaw: number;
  renewablePercent: string;
  percentageRank: string;
  stateColor: array;

  constructor(private route: ActivatedRoute) { 
  }

  getStateColor() {
    return { 'color': this.stateColor[0] };
  }

  async ngOnInit() {
    await this.getRenewableData();
    await this.getTotalData();
    await this.renewableChart();
    await this.traditionalChart();
  }

  async getRenewableData() {
    const response = await fetch(`http://api.eia.gov/series/?api_key=${apiKey}&series_id=SEDS.REPRB.${this.state}.A`);
    const rawRenewableData = await response.json();
    this.cleanRenewableData(rawRenewableData);
  }

  async getTotalData() {
    const response = await fetch(`http://api.eia.gov/series/?api_key=${apiKey}&series_id=SEDS.TEPRB.${this.state}.A`);
    const rawTotalData = await response.json();
    this.cleanTotalData(rawTotalData);
  }

  cleanRenewableData(rawRenewableData) {
    this.name = rawRenewableData.series[0].name.split(', ')[1];
    this.nameForFile = this.name.replace(/\s+/g, '_');
    this.renewableData = rawRenewableData.series[0].data;
    this.units = rawRenewableData.series[0].units;
    this.source = rawRenewableData.series[0].source;
    this.rankRaw = stateData.stateData[this.state].rankRaw;
    const percent = this.getRenewablePercent(this.state);
    this.renewablePercent = percent.toFixed(2);
    this.percentageRank = this.getPercentageRank(this.state);
    this.stateColor = stateData.stateData[this.state].primary;
  }

  getRenewablePercent(state) {
    return (stateData.stateData[state].currentRenewable / stateData.stateData[state].currentTotal) * 100;
  }

  getPercentageRank(state) {
    let percentages = Object.keys(stateData.stateData).reduce((array, key) => {
      array.push({
        state: key,
        renewablePercent: this.getRenewablePercent(key)
      })
      return array;
    }, []);
    percentages = percentages.sort((a, b) => {
      return b.renewablePercent - a.renewablePercent;
    })
    const rank = percentages.findIndex(abbr => abbr.state === state);
      
    return percentages[rank].renewablePercent === 100 ? 1 : rank + 1;
  }

  cleanTotalData(rawTotalData) {
    this.totalData = rawTotalData.series[0].data;
  }

  renewableChart() {
    const element = this.el.nativeElement;
    const data = [{
      x: this.renewableData.map(year => year[0]).reverse(),
      y: this.renewableData.map(year => year[1]).reverse(),
      type: 'bar',
      name: 'Renewable',
      marker: { color: this.stateColor[1] }
      // marker: { color: '#6ea363' }
    }];
    const layout = {
      barmode: 'stack',
      title: `Renewable Energy Production vs. Traditional Energy Sources - ${this.name}`,
      titlefont: {
        size: 20,
        color: "#777",
        weight: 500
      },
      yaxis: {
        title: this.units
      }
    };
    const style = {
      margin: { t: 0 }
    };

    Plotly.plot(element, data, layout, style);
  }

  traditionalChart() {
    const xAxis = this.totalData.map(year => year[0]).reverse();
    const yAxis = this.totalData.map(year => year[1]).reverse();
    const renew = this.renewableData.map(year => year[1]).reverse();
    const element = this.el.nativeElement;
    const data = [{
      x: xAxis,
      y: yAxis.map((year, index) => year - renew[index]),
      type: 'bar',
      name: 'Traditional',
      marker: { color: this.stateColor[0] }
      // marker: { color: '#ffca3f' }
    }];

    Plotly.plot(element, data);
  }

}
