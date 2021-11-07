import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-b',
  templateUrl: './component-b.component.html',
  styleUrls: ['./component-b.component.css']
})
export class ComponentBComponent implements OnInit {

  text = $localize `:b ts var|Text for TypeScript variable of B@@componentB.tsVar:Component B text in TypeScript variable`;
  varToInterpolate = 'lorem ipsum';
  interpolatedText =  $localize `:b interpolated text|Text for TypeScript variable of B with interpolated text@@componentB.interpolatedTsVar:This text is from an interpolated variable of component B: '${this.varToInterpolate}:varToInterpolate:'`;

  constructor() { }

  ngOnInit(): void {
  }

}
