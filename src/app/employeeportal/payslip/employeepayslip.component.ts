import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-employeepayslip',
  templateUrl: './employeepayslip.component.html',
  styleUrls: ['./employeepayslip.component.css']
})
export class EmployeePayslipComponent implements OnInit {

  constructor(private httpClient : HttpClient, private sanitizer: DomSanitizer) { }
  data:any;
  spin1:boolean = false;
  link='';
  header = 'data:application/pdf;base64,'
  finalLink : SafeResourceUrl

  username = sessionStorage.getItem('username')

  form = new FormGroup({
		month: new FormControl(''),
		year: new FormControl(''),
  })

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  // this.httpClient.get(`${this.SERVER}/emppayslip`).subscribe(res => {
  //   this.header = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PAYAGE.Response'].T_CLOSEDITEMS.item
  //     this.spin1 = true;
  //   this.data = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PAYAGE.Response'].T_OPENITEMS.item
  //     this.spin2 = true;
  // })
  }
  onSubmit(){ 
    this.spin1 = true;
    this.httpClient.post(`${this.SERVER}/emppayslip`, this.form.value).subscribe(res => {
      this.link = res['BASE64']._text
      this.header = this.header + this.link
      this.finalLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.header)
      this.spin1 = false;
    })
  }
}
