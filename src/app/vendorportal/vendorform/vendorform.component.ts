import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { NgTinyUrlService } from 'ng-tiny-url';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'app-vendorform',
  templateUrl: './vendorform.component.html',
  styleUrls: ['./vendorform.component.css']
})
export class VendorformComponent implements OnInit {

  header = 'data:application/pdf;base64,'
  number = '';
  year = '';
  spin1:boolean = true;
  link = ''
  finalLink : SafeResourceUrl
  text = 'Generate PDF'
  form = new FormGroup({
		number: new FormControl(''),
		year: new FormControl(''),
	});

  constructor(private httpClient: HttpClient, private router: Router, private sanitizer: DomSanitizer, private tiny: NgTinyUrlService) { }

  ngOnInit(): void {
  }

  SERVER = "http://localhost:3000";

  onSubmit(){ 
    this.text = 'Generating PDF'
    this.spin1 = false
    this.httpClient.post(`${this.SERVER}/vendorform`, this.form.value).subscribe(res => {
      if(res){
        this.text = 'PDF Generated'
        this.spin1 = true
        this.link = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_INVOICE_CALLER.Response']['E_INVOICE_DOC']['_text']
        this.link = encodeURI(this.link)
        this.header = this.header + this.link
        console.log(this.header)
        this.finalLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.header)
        // this.tiny.shorten(this.header).subscribe(res => {
        //   this.finalLink = res
        // })
        // this.router.navigate([]).then(result=> { window.open(this.header, '_balnk') })
      }
    })
    }
}
