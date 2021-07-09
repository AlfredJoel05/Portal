import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendorrequest',
  templateUrl: './vendorrequest.component.html',
  styleUrls: ['./vendorrequest.component.css']
})
export class VendorrequestComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin1:boolean = false;
  header:any;
  spin2:boolean = false;
  vendorname = sessionStorage.getItem('fullname')

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/vendorrequest`).subscribe(res => {
    this.header = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_RFQ.Response'].T_RFQ_HEADER.item
      this.spin1 = true;
    this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_RFQ.Response'].T_RFQ_ITEMS.item
      this.spin2 = true;
  })
  }

}
