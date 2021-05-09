import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { SalesService } from './sales.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {

  constructor(private salesService : SalesService, private httpClient : HttpClient) { }
  data:any;
  spin:boolean = false;

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  this.httpClient.get(`${this.SERVER}/salesorder`).subscribe(res => {
      
      this.data = res['item']
      console.log('Sales Component'+this.data)
      this.spin = true;
  })
  }
}
