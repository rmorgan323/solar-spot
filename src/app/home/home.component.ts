import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    document.querySelector(`.t-${state}`).style.opacity = "1";
    document.getElementById(state).style.fill = "#d3e9ce";
  }

  stateRemoveDisplay(state) {
    document.querySelector(`.t-${state}`).style.opacity = "0";
    document.getElementById(state).style.fill = "#b6dcae";
  }

}
