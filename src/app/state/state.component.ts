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
  @ViewChild('comparisonchart') el2: ElementRef;

  state: string = this.route.params._value.abbr;
  title: string;
  data: array;
  units: string;
  source: string;

  constructor(private route: ActivatedRoute) { 
  }

  async ngOnInit() {
    await this.getStateData();
    await this.basicChart();
    await this.comparisonChart();
  }

  async getStateData() {
    const response = await fetch(`http://api.eia.gov/series/?api_key=${apiKey}&series_id=SEDS.REPRB.${this.state}.A`)
    const rawStateData = await response.json();
    this.cleanStateData(rawStateData);
  }

  cleanStateData(rawStateData) {
    this.title = rawStateData.series[0].name;
    this.data = rawStateData.series[0].data;
    this.units = rawStateData.series[0].units;
    this.source = rawStateData.series[0].source;
  }

  basicChart() {
    const element = this.el.nativeElement;
    const data = [{
      x: this.data.map(year => year[0]).reverse();
      y: this.data.map(year => year[1]).reverse();
    }];
    const layout = {
      title: this.title,
      yaxis: {
        title: this.units
      }
    };
    const style = {
      margin: { t: 0 }
    };

    Plotly.plot(element, data, layout, style)
  }

  comparisonChart() {
    const element = this.el2.nativeElement;
    const data = [{
      x: this.data.map(year => year[0]).reverse();
      y: this.data.map(year => year[1]).reverse();
    }];
    const layout = {
      title: this.title,
      yaxis: {
        title: this.units
      }
    };
    const style = {
      margin: { t: 0 }
    };

    Plotly.plot(element, data, layout, style)
  }

}
