import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-monitored-tests',
  inputs: ['monitoredTests:monitoredTests'],
  templateUrl: './monitored-tests.component.html',
  styleUrls: ['./monitored-tests.component.css']
})
export class MonitoredTestsComponent implements OnInit {

authToken : any;
urlbase = "https://cors-anywhere.herokuapp.com/"+"http://119.81.217.94:8080/api/plugins/telemetry/DEVICE/544004b0-c850-11e7-89af-f34162121867/values/timeseries?keys=";
parameters = "Vehicle_ECT," + "Bat_Volt_Sts," + "MIL_Status," + "No_Of_DTC_Prs";
thingsboardDeviceData : any;

vehicleHealth = [];
vehicleHealth1 = [];

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

refreshData() {
        this.vehicleHealth = [];
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
                        this.vehicleHealth.push({"key":key,"value":val.value});
                    });
                    this.vehicleHealth1 = this.vehicleHealth;
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
