import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { colors, stateData } from './home.component.data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentState: string;
  stateRank: string;
  stateRankYVal: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  stateLink(state) {
    this.router.navigate([`state/${state}`]);
  }

  stateDisplay(state) {
    document.getElementById(state).style.fill = stateData[state].primary[0];
    document.querySelector(`.t-${state}`).style.fill = stateData[state].primary[1];
    document.querySelector(`.t-${state}`).style.opacity = "1";
    document.querySelector(`.k-${state}`).style.opacity = "1";
    this.currentState = state;
    this.stateRank = stateData[state].rankRaw;
    this.stateRankYVal = this.getStateRank(state);
  }

  getStateRank(state) {
    return 351 + stateData[state].rankRaw * 6;
  }

  stateRemoveDisplay(state) {
    document.querySelector(`.t-${state}`).style.opacity = "0";
    document.querySelector(`.k-${state}`).style.opacity = "0";
    document.getElementById(state).style.fill = this.getStateFill(state);
    this.currentState: '';
    this.stateRank = '';
    this.stateRankYVal = '';
  }

  getStateFill(state) {
    for (let i = 0; i < colors.length; i++) {
      if (stateData[state].currentRenewable <= colors[i].range) {
        return colors[i].hex;
      }
    }    
  }

  getStateColor() {
    return { 'fill': stateData[this.currentState].primary[0] };
  }

}
