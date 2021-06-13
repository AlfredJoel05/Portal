import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {

  constructor( private httpClient : HttpClient) { }
  data:any;
  header:any;
  spin1:boolean = false;
  spin2:boolean = false;

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/leavedetails`).subscribe(res => {
      this.header = res['IT_LEAVE_DETAILS']['item']
      this.spin1 = true;
      this.data = res['IT_LEAVE_REMAIN']['item']
      this.spin2 = true;
  })

//   this.httpClient.get(`${this.SERVER}/leaverequest`).subscribe(res => {
//     this.header = res['IT_LEAVE_DETAILS']['item']
//     this.spin1 = true;
//     this.data = res['IT_LEAVE_REMAIN']['item']
//     this.spin2 = true;
// })
//   this.httpClient.get(`${this.SERVER}/leavedelete`).subscribe(res => {
//     this.header = res['IT_LEAVE_DETAILS']['item']
//     this.spin1 = true;
//     this.data = res['IT_LEAVE_REMAIN']['item']
//     this.spin2 = true;
// })
  }
}
