import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-a',
  templateUrl: './component-a.component.html',
  styleUrls: ['./component-a.component.css']
})
export class ComponentAComponent implements OnInit {

  text = $localize `:a ts var|Text for TypeScript variable of A@@componentA.tsVar:Component A text in TypeScript variable`;
  varToInterpolate = 'lorem ipsum';
  interpolatedText =  $localize `:A interpolated text|Text for TypeScript variable of A with interpolated text@@componentA.interpolatedTsVar:This text is from an interpolated variable of component A: '${this.varToInterpolate}:varToInterpolate:'`;

  constructor() { }

  ngOnInit(): void {
  }

}
