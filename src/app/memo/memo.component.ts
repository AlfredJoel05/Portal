import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin:boolean = false;

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/memo`).subscribe(res => {
    this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFI_CREDIT_DEBIT_MEMO_AJ.Response'].IT_DETAILS.item
  //     this.spin = false;
  })
  }

}
