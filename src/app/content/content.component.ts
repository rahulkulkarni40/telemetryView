import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-content',
  inputs: ['view: view','deviceName: name'],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
    
    selectedDevice : Object;
    constructor() {
    }
      ngOnInit() {
          
      }

}
