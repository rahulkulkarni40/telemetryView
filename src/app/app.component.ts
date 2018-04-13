import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Telemetry View';
  
  authToken : any;
  urlbase = "https://cors-anywhere.herokuapp.com/"+"http://119.81.217.94:8080/api/plugins/telemetry/DEVICE/544004b0-c850-11e7-89af-f34162121867/values/timeseries?keys=";
  parameters = "Vehicle_ECT," + "Bat_Volt_Sts," + "MIL_Status," + "No_Of_DTC_Prs";
  thingsboardDeviceData : any;
  interval :any;
  
  parametersDateTime = "Curr_Date,Curr_Time"

  vehicleDataparameters = "Vehicle_Speed,"
              + "Vehicle_Engine_RPM"
              + "Vehicle_ECT,"
              + "Vehicle_MAF,"
              + "Vehicle_MAP,"
              + "Intake_Air_Temp,"
              + "Abs_Throttle_Pos,"
              + "Bat_Volt_Sts,"
              + "Abs_Acc_Pedal_Pos,"
              + "Veh_Pos_Long,"
              + "Veh_Pos_Latt,"
              + "IMEI_number,"
              + "Engine_Load,"
              + "Engine_Retarder_Torque";
  
  driverBehaviourparameters =      "Swirving_Event_Cnt,"
      + "Harsh_Accel_Cnt,"
      + "Harsh_Breaking_Cnt,"
      + "Long_Idling_Cnt,"
      + "Short_Idling_Cnt,"
      + "Harsh_Breaking_Cnt,"
      + "Bat_Discon_Event_Cnt,"
      + "Eng_Breaking_Event_Cnt,"
      + "Eng_High_Rev_Cnt,"
      + "Over_Speeding_Lvl1_Cnt,"
      + "Over_Speeding_Lvl2_Cnt";
  
  constructor(private http:HttpClient) {
      this.btnView1 = 'btn-clicked';
      this.btnVehicleData = 'btn-default';
      this.btnPerformanceBehaviour = 'btn-default';
      this.btnVehicleHealth = 'btn-default';
      this.btnCrashReport = 'btn-default';
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
  
  vehicleData = [];
  dateTime = [];
  driverBehaviour = [];
  
  refreshData() {
      this.vehicleData = [];
      let url = this.urlbase + this.parametersDateTime;
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
                      this.dateTime.push({"key":key,"value":val.value});
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
      
      url = this.urlbase + this.vehicleDataparameters;

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
                      this.vehicleData.push({"key":key,"value":val.value});
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
      
      url = this.urlbase + this.driverBehaviourparameters;

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
                      this.driverBehaviour.push({"key":key,"value":val.value});
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

  
  ngOnInit() {
      
  }
  
  selectedView :any;
  view1 = true;
  viewVehicleData = false;
  viewPerformanceBehaviour = false;
  viewVehicleHealth = false;
  viewCrashReport = false;
  
  btnView1: string;
  btnVehicleData: string;
  btnPerformanceBehaviour: string;
  btnVehicleHealth: string;
  btnCrashReport: string;
  
  clickedFlag : any;
  showView1(event){
      this.btnView1 = 'btn-clicked';
      this.btnVehicleData = 'btn-default';
      this.btnPerformanceBehaviour = 'btn-default';
      this.btnVehicleHealth = 'btn-default';
      this.btnCrashReport = 'btn-default';
      this.view1 = true;
      this.viewVehicleData = false;
      this.viewPerformanceBehaviour = false;
      this.viewVehicleHealth = false;
      this.viewCrashReport = false;
  }
  
  showViewVehicleData(event){
      this.btnView1 = 'btn-default';
      this.btnVehicleData = 'btn-clicked';
      this.btnPerformanceBehaviour = 'btn-default';
      this.btnVehicleHealth = 'btn-default';
      this.btnCrashReport = 'btn-default';
      this.view1 = false;
      this.viewVehicleData = true;
      this.viewPerformanceBehaviour = false;
      this.viewVehicleHealth = false;
      this.viewCrashReport = false;
  }
  
  showPerformanceBehaviour(event){
      this.btnView1 = 'btn-default';
      this.btnVehicleData = 'btn-default';
      this.btnPerformanceBehaviour = 'btn-clicked';
      this.btnVehicleHealth = 'btn-default';
      this.btnCrashReport = 'btn-default';
      this.view1 = false;
      this.viewVehicleData = false;
      this.viewPerformanceBehaviour = true;
      this.viewVehicleHealth = false;
      this.viewCrashReport = false;
  }
  
  showVehicleHealth(event){
      this.btnView1 = 'btn-default';
      this.btnVehicleData = 'btn-default';
      this.btnPerformanceBehaviour = 'btn-default';
      this.btnVehicleHealth = 'btn-clicked';
      this.btnCrashReport = 'btn-default';
      this.view1 = false;
      this.viewVehicleData = false;
      this.viewPerformanceBehaviour = false;
      this.viewVehicleHealth = true;
      this.viewCrashReport = false;
  }
  
  showCrashReport(event){
      this.btnView1 = 'btn-default';
      this.btnVehicleData = 'btn-default';
      this.btnPerformanceBehaviour = 'btn-default';
      this.btnVehicleHealth = 'btn-default';
      this.btnCrashReport = 'btn-clicked';
      this.view1 = false;
      this.viewVehicleData = false;
      this.viewPerformanceBehaviour = false;
      this.viewVehicleHealth = false;
      this.viewCrashReport = true;
  }
}
