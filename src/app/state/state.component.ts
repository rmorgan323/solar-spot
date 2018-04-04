import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import apiKey from '../../apiKey';
import * as Plotly from 'plotly.js';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {

  @ViewChild('simplechart') el: ElementRef;

  state: string = this.route.params._value.abbr;
  name: string;
  totalData: array;
  renewableData: array;
  units: string;
  source: string;

  constructor(private route: ActivatedRoute) { 
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
    this.name = rawRenewableData.series[0].name.split(', ')[1]
    this.renewableData = rawRenewableData.series[0].data;
    this.units = rawRenewableData.series[0].units;
    this.source = rawRenewableData.series[0].source;
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
      marker: { color: '#6ea363' }
    }];
    const layout = {
      barmode: 'stack',
      title: `Renewable Energy Production vs. Traditional Energy Sources - ${this.name}`,
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
      marker: { color: '#ffca3f' }
    }];

    Plotly.plot(element, data);
  }

}
