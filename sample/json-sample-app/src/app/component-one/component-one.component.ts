import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-one',
  templateUrl: './component-one.component.html',
  styleUrls: ['./component-one.component.css'],
})
export class ComponentOneComponent implements OnInit {
  text = $localize`:one ts var|Text for TypeScript variable of Component One@@componentOne.tsVar:Component One text in TypeScript variable`;
  varToInterpolate = 'lorem ipsum';
  interpolatedText = $localize`:component one interpolated text|Text for TypeScript variable of Component One with interpolated text@@componentOne.interpolatedTsVar:This text is from an interpolated variable of Component One: '${this.varToInterpolate}:varToInterpolate:'`;

  constructor() {}

  ngOnInit(): void {}
}
