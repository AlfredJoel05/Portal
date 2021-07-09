import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin:boolean = false;
  soldto = sessionStorage.getItem('fullname')
  SERVER = "http://localhost:3000";

  ngOnInit() :void  {
    this.httpClient.get(`${this.SERVER}/delivery`).subscribe(res => {
      this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_DELIVERY_DETAILS.Response'].IT_DELIVERY_T.item
      this.spin = true;
    })
  }
  
}
