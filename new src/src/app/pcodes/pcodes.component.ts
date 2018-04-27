import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { RequestOptions } from "@angular/http/http";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-pcodes',
  templateUrl: './pcodes.component.html',
  styleUrls: ['./pcodes.component.css']
})
export class PcodesComponent implements OnInit {
  
    interval :any;

    constructor(private http:HttpClient) {
        let token : any;
        this.http.post('http://119.81.217.94:8080/api/auth/login', {'username':'tenant@thingsboard.org','password':'tenant'})
        .subscribe(res => {
            token = res;
            this.authToken =  'Bearer ' + token.token; 
            console.log(this.authToken);
            this.refreshData();
            this.interval = setInterval(() => { 
                this.refreshData(); 
            }, 20000);
        });
    }
    
  ngOnInit() {
      //this.getPosts();
  }
  
  thingsboardDeviceData : any;
  authToken : any;
  urlbase = "https://cors-anywhere.herokuapp.com/"+"http://119.81.217.94:8080/api/plugins/telemetry/DEVICE/544004b0-c850-11e7-89af-f34162121867/values/timeseries?keys=";

  pCodes :Array<any>;
  
  refreshData(){
      let url = this.urlbase + "DTC_Info_List";

      this.http.get(url,{headers:{'Content-Type':'application/json','X-Authorization': this.authToken}})
      .subscribe(res => {
          this.thingsboardDeviceData = res;
              console.log(this.thingsboardDeviceData);
              let tbDataKeys = Object.keys(this.thingsboardDeviceData);
              tbDataKeys.forEach(key => {
                  let value = this.thingsboardDeviceData[key];
                  value.forEach(val =>{
                      console.log(val.value);
                      this.pCodes = val.value.split(',');
                      console.log(this.pCodes);
                  });
                });
          },
          err => {
              console.log("Error occured." + err)
              for(var errItem in err){
                  console.log(errItem)
                  console.log(err[errItem])
              }
          });  
  }
  
    selectedCode : any;
    selectedTroubleObject : any;
    troubleDescriptionSegments : Array<any>;
        
    showpcodeDetails(event){
        console.log(event.path[0].innerText);
        this.selectedCode = event.path[0].innerText;
        
        let url = this.urlbase + this.selectedCode;

        this.http.get(url,{headers:{'Content-Type':'application/json','X-Authorization': this.authToken}})
        .subscribe(res => {
            this.selectedTroubleObject = res;
                console.log(this.selectedTroubleObject);
                let troubleKeys = Object.keys(this.selectedTroubleObject);
                troubleKeys.forEach(key => {
                    let value = this.selectedTroubleObject[key];
                    value.forEach(val =>{
                        console.log(val.value);
                        this.troubleDescriptionSegments = val.value.split(',');
                    });
                  });
            },
            err => {
                console.log("Error occured." + err)
                for(var errItem in err){
                    console.log(errItem)
                    console.log(err[errItem])
                }
            });  
    }
}
