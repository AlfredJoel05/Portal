import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-masterdata',
  templateUrl: './masterdata.component.html',
  styleUrls: ['./masterdata.component.css']
})
export class MasterdataComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private http: HttpClient, private router: Router) {}
  upload_response;
  public file: any;
  public xl_data: any = [];
  getFilename(ev: any) {
    this.file = ev.target.files[0];
  }
  upload() {
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.xl_data = jsonData['Sheet1'];
      this.upload_to_sap();
    };
    reader.readAsBinaryString(this.file);
  }
  async upload_to_sap() {
    for (let i = 0; i < this.xl_data.length; i++) {
      console.log(this.xl_data[i]);
      this.http.post('http://localhost:3000/masterdataupload', this.xl_data[i]).subscribe(result => {
        
      alert(result['_text'])
        
      })
    }
  }

}
