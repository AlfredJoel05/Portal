import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-vendormemo',
  templateUrl: './vendormemo.component.html',
  styleUrls: ['./vendormemo.component.css']
})
export class VendormemoComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  credit:any;
  debit:any;
  spin1:boolean = false;
  spin2:boolean = false;

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/vendormemo`).subscribe(res => {
    this.credit = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFI_VP_CREDIT_DEBIT_MEMO.Response']['T_CREDIT']['item']
      this.spin1 = true;
    this.debit = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFI_VP_CREDIT_DEBIT_MEMO.Response'].T_DEBIT.item
      this.spin2 = true;
  })
  }
}
