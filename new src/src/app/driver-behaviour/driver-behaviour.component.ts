import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-driver-behaviour',
  inputs: ['driverBehaviour:driverBehaviour'],
  templateUrl: './driver-behaviour.component.html',
  styleUrls: ['./driver-behaviour.component.css']
})
export class DriverBehaviourComponent implements OnInit {

  authToken : any;
  urlbase = "https://cors-anywhere.herokuapp.com/"+"http://119.81.217.94:8080/api/plugins/telemetry/DEVICE/544004b0-c850-11e7-89af-f34162121867/values/timeseries?keys=";
  parameter_start_time = "Curr_Time"; 
  parameters = "Harsh_Braking_Cnt," + "Harsh_Accel_Cnt," + "Swirving_Event_Cnt," + "Long_Idling_Cnt," + "Short_Idling_Cnt," + "Over_Speeding_Lvl1_Cnt," + "Over_Speeding_Lvl2_Cnt," + "Eng_High_Rev_Cnt," + "Eng_Braking_Event_Cnt," + "Bat_Discon_Event_Cnt," + "Driver_Score_Val" ;
  thingsboardDeviceData : any;
  
  vehicleHealth = [];
  vehicleHealth1 = [];
  vehicleHealthy = [];
  vehicleHealthdata = [];
  current;
  scantime =20000;
  startpoint;
  endpoint;
  time1;
   interval :any;
  constructor(private http:HttpClient) {
      let token : any;
      this.http.post('http://119.81.217.94:8080/api/auth/login', {'username':'tenant@thingsboard.org','password':'tenant'})
      .subscribe(res => {
          token = res;
          this.authToken =  'Bearer ' + token.token; 
          console.log(this.authToken);
          this.refreshVData();
          this.interval = setInterval(() => { 
              this.refreshVData1();
               
          }, 20000);
      });
  }
  
  refreshVData() {
    this.vehicleHealth = [];
       let url = this.urlbase + this.parameter_start_time;
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
                    this.vehicleHealth.push({"key":key,"value":val.ts});
                                      });
                                     this.vehicleHealthy = this.vehicleHealth;
                                      });
                                      this.current = this.vehicleHealthy[0].value;                                              
                                      this.endpoint = this.current;
                                      this.startpoint = this.endpoint - this.scantime;
                                      console.log("after");
                                      console.log(this.endpoint,this.startpoint);
            },
        err => {
            console.log("Error occured." + err)
            for(var errItem in err){
                console.log(errItem)
                console.log(err[errItem])
            }
        });          
  }
  refreshVData1() {
    this.time1 = "&startTs=" + this.startpoint + "&endTs=" + this.endpoint + "&interval=0&limit=1&agg=NONE";
    this.vehicleHealth1 = [];
    this.vehicleHealthdata = [];
       let url = this.urlbase + this.parameters + this.time1;
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
                    this.vehicleHealth1.push({"key":key,"value":val.value});
                                      });
                                     this.vehicleHealthdata = this.vehicleHealth1;
                                      });
                                      console.log("before");
                                      console.log(this.startpoint,this.endpoint);
                                      this.endpoint = this.startpoint;
                                     this.startpoint = this.endpoint - this.scantime;
                                    console.log("after");
                                      console.log(this.endpoint,this.startpoint);
                            
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
