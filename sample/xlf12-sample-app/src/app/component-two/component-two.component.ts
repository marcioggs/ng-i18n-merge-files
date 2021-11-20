import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-two',
  templateUrl: './component-two.component.html',
  styleUrls: ['./component-two.component.css'],
})
export class ComponentTwoComponent implements OnInit {
  text = $localize`:two ts var|Text for TypeScript variable of Component Two@@componentTwo.tsVar:Component Two text in TypeScript variable`;
  varToInterpolate = 'lorem ipsum';
  interpolatedText = $localize`:component two interpolated text|Text for TypeScript variable of Component Two with interpolated text@@componentTwo.interpolatedTsVar:This text is from an interpolated variable of Component Two: '${this.varToInterpolate}:varToInterpolate:'`;

  constructor() {}

  ngOnInit(): void {}
}
