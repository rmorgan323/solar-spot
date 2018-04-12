import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { colors, stateData } from './home.component.data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
  }

  stateRemoveDisplay(state) {
    document.querySelector(`.t-${state}`).style.opacity = "0";
    document.getElementById(state).style.fill = this.getStateFill(state);
  }

  getStateFill(state) {
    for (let i = 0; i < colors.length; i++) {
      if (stateData[state].currentRenewable <= colors[i].range) {
        return colors[i].hex;
      }
    }    
  }

}
