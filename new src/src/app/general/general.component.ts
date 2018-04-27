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
    parameter_start_time = "Curr_Time";
    parameters = "Odometer_Val," + "Curr_Time," + "IMEI_number," + "Vehicle_VIN," + "Curr_Date";
    thingsboardDeviceData : any;
    deviceInfo = [];
    deviceInfo1 = [];
    deviceInfo2 = [];
    duration = 0;
    duration1 = 0;
    duration2 = 0;
    current;
    startpoint;
    endpoint;
    time1;
    previous1 = 0;
    min=[];
    scantime=20000;
   
    deviceInf = [];
    interval :any;
    constructor(private http:HttpClient) {
        let token : any;
        this.http.post('http://119.81.217.94:8080/api/auth/login', {'username':'tenant@thingsboard.org','password':'tenant'})
        .subscribe(res => {
            token = res;
            this.authToken =  'Bearer ' + token.token; 
            console.log(this.authToken);
            this.refreshData_gen();
            //this.refreshData1();
            this.interval = setInterval(() => { 
                this.refreshData1_gen();
                 
            }, 20000);
        });
    }
    //Code for fetching time form ts for giving start point and end point for fetching the data.
    refreshData_gen() {
        this.deviceInfo = [];
        this.deviceInf = [];
        let url = this.urlbase + this.parameter_start_time;
        this.http.get(url,{headers:{'Content-Type':'application/json','X-Authorization': this.authToken}})
        .subscribe(res => {
            this.thingsboardDeviceData = res;
                console.log(this.thingsboardDeviceData);
                let tbDataKeys = Object.keys(this.thingsboardDeviceData);
                //Fetching ts values.
                tbDataKeys.forEach(key => {
                    console.log(key);
                    let value = this.thingsboardDeviceData[key];
                    value.forEach(val =>{
                        console.log(val.value);
                       this.deviceInf.push({"key":key,"value":val.ts});
                                          });
                        this.deviceInf=this.deviceInf;   

                                       });    
                        this.current = this.deviceInf[0].value;
                         //Storing start and end points initially for first itteration                      
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
        refreshData1_gen() {
                //API code to fetch data using start point and end point with interval and limit.
                this.time1 = "&startTs=" + this.startpoint + "&endTs=" + this.endpoint + "&interval=0&limit=1&agg=NONE";
                this.deviceInfo = [];
                this.deviceInf = [];
                let url = this.urlbase + this.parameters + this.time1;
                this.http.get(url,{headers:{'Content-Type':'application/json','X-Authorization': this.authToken}})
                .subscribe(res => {
                    this.thingsboardDeviceData = res;
                        console.log(this.thingsboardDeviceData);
                        let tbDataKeys = Object.keys(this.thingsboardDeviceData);
                        //Fetching values to display for different parameters.
                        tbDataKeys.forEach(key => {
                            console.log(key);
                            let value = this.thingsboardDeviceData[key];
                            value.forEach(val =>{
                                console.log(val.value);
                                this.deviceInfo.push({"key":key,"value":val.value});
                                                  });
                            this.deviceInfo1=this.deviceInfo;
                           value.forEach(val =>{
                               // console.log(val.value);
                               this.deviceInf.push({"key":key,"value":val.ts});
                                                  });
                                this.deviceInfo2=this.deviceInf;   
        
                                               });   
                                             
                                this.duration +=this.scantime;
                                //converting UTC values from miliseconds to seconds
                                this.duration1 = this.duration/1000; 
                                //Converting into minutes and seconds to dispaly duration.
                               this.min = this.cts(this.duration1);
                                console.log("before");
                                console.log(this.startpoint,this.endpoint);
                                //Re assigning start and end points for next data fetch.
                                this.endpoint = this.startpoint;
                                this.startpoint = this.endpoint - this.scantime;
                              // this.endpoint += this.scantime;
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
      //Function to convert data to min and seconds.
      cts(seconds){
        var minutes;
      var seconds;
      minutes = Math.floor(seconds/60);
      seconds = Math.floor(seconds%60);
      //Returning data in the form of array .
      return [minutes, seconds];
      }
      

  ngOnInit() {
  }

}
