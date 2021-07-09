import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendorpurchase',
  templateUrl: './vendorpurchase.component.html',
  styleUrls: ['./vendorpurchase.component.css']
})
export class VendorpurchaseComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin1:boolean = false;
  header:any;
  spin2:boolean = false;
  fullname = sessionStorage.getItem('fullname')

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/vendorpurchase`).subscribe(res => {
    this.header = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PURCHASE.Response'].T_PO_HEADER.item
      this.spin1 = true;
    this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PURCHASE.Response'].T_PO_ITEMS.item
      this.spin2 = true;
  })
  }

}
