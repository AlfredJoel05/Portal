import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-goodsreceipt',
  templateUrl: './goodsreceipt.component.html',
  styleUrls: ['./goodsreceipt.component.css']
})
export class GoodsreceiptComponent implements OnInit {

  constructor( private httpClient : HttpClient) { }
  data:any;
  header:any;
  spin1:boolean = false;
  spin2:boolean = false;

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/goodsreceipt`).subscribe(res => {
      this.header = res['T_GOODSMVT_HEADER']['item']
      this.spin1 = true;
      this.data = res['T_GOODSMVT_ITEMS']['item']
      this.spin2 = true;
  })
  }
}
