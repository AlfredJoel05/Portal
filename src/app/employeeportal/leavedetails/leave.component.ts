import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

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

  formReq = new FormGroup({
		sdate: new FormControl(''),
		edate: new FormControl(''),
		type: new FormControl(''),
  })
  formDel = new FormGroup({
    dsdate: new FormControl(''),
		dedate: new FormControl(''),
		dtype: new FormControl(''),
		drecnum: new FormControl(''),
  })

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/leavedetails`).subscribe(res => {
      this.header = res['IT_LEAVE_DETAILS']['item']
      this.spin1 = true;
      this.data = res['IT_LEAVE_REMAIN']['item']
      this.spin2 = true;
  })}

  onSubmitRequest(){ 
    this.httpClient.post(`${this.SERVER}/leaverequest`, this.formReq.value).subscribe(res => {
      console.log(res)
    })
  }
  onSubmitDelete(){ 
    this.httpClient.post(`${this.SERVER}/leaverequest`, this.formDel.value).subscribe(res => {
      console.log(res)
    })
  }
}
