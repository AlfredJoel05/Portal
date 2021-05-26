import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-vendorpayage',
  templateUrl: './vendorpayage.component.html',
  styleUrls: ['./vendorpayage.component.css']
})
export class VendorpayageComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin1:boolean = false;
  header:any;
  spin2:boolean = false;

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/vendorpayage`).subscribe(res => {
    this.header = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PAYAGE.Response'].T_CLOSEDITEMS.item
      this.spin1 = true;
    this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PAYAGE.Response'].T_OPENITEMS.item
      this.spin2 = true;
  })
  }
}
