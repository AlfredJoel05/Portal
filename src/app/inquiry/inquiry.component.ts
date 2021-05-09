import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'


@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin:boolean = false;

  SERVER = "http://localhost:3000";


  ngOnInit() {

    this.httpClient.get(`${this.SERVER}/inquiry`).subscribe(res => {
      
      this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_CUSTOMER_INQUIRY_AJ.Response'].ZSD_INQUIRYDETAILS_AJ_T.item
    //     this.spin = false;
    })
    }
  }
