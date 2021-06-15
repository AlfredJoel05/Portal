import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-finalsettle',
  templateUrl: './fs.component.html',
  styleUrls: ['./fs.component.css']
})
export class FinalSettleComponent implements OnInit {

  constructor(private httpClient : HttpClient) { }
  data:any;
  spin1:boolean = true;
  flag:string;


  TYPES = ['CREATE', 'DELETE', 'CHECK']

  form = new FormGroup({
		type: new FormControl('DISPLAY'),
  })

  SERVER = "http://localhost:3000";

  ngOnInit(): void {

  // this.httpClient.post(`${this.SERVER}/empfs`, this.form.value ).subscribe(res => {
  //   this.data = res
  //   alert(this.flag)
  // })

  }

  onSubmit(){
    if(this.form.value.type === 'CREATE'){
    this.httpClient.post(`${this.SERVER}/empfs`, this.form.value).subscribe(res => {
      this.flag = res['E_CREATE_FLAG']['_text']
      alert(this.flag) })
   }
    else if(this.form.value.type === 'CHECK'){
    this.httpClient.post(`${this.SERVER}/empfs`, this.form.value).subscribe(res => {
      this.flag = res['E_CHECK_FLAG']['_text']
      alert(this.flag) })
   }
    else if(this.form.value.type === 'DELETE'){
    this.httpClient.post(`${this.SERVER}/empfs`, this.form.value).subscribe(res => {
      this.flag = res['E_REMOVE_FLAG']['_text']
      alert(this.flag) })
   }
  }
}
