import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  inputs: ['descSegments:descSegments','pCode:pCode'],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
