import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

    authToken : any;
    urlbase = "https://cors-anywhere.herokuapp.com/"+"http://119.81.217.94:8080/api/plugins/telemetry/DEVICE/544004b0-c850-11e7-89af-f34162121867/values/timeseries?keys=";
    parameters = "IMEI_number," + "Vehicle_VIN," + "Curr_Date";
    thingsboardDeviceData : any;
    
    deviceInfo = [];
    deviceInfo1 = [];
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
            }, 15000);
        });
    }
    
    refreshData() {
        this.deviceInfo = [];
        let url = this.urlbase + this.parameters;
        this.http.get(url,{headers:{'Content-Type':'application/json','X-Authorization': this.authToken}})
        .subscribe(res => {
            this.thingsboardDeviceData = res;
                console.log(this.thingsboardDeviceData);
                let tbDataKeys = Object.keys(this.thingsboardDeviceData);
                
                tbDataKeys.forEach(key => {
                    console.log(key);
                    let value = this.thingsboardDeviceData[key];
                    value.forEach(val =>{
                        console.log(val.value);
                        this.deviceInfo.push({"key":key,"value":val.value});

                    });
                    this.deviceInfo1=this.deviceInfo;
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

  ngOnInit() {
  }

}
