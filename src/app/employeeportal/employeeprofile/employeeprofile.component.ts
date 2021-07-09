import { Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { EmployeeprofileService } from './employeeprofile.service'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { EmployeeAuthService } from '../auth/eauth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-employeeprofile',
  templateUrl: './employeeprofile.component.html',
  styleUrls: ['./employeeprofile.component.css']
})
export class EmployeeprofileComponent implements OnInit {
  f_name='';
  l_name='';
  mobile='';
  street='';
  city='';
  state='';
  country='';
  pin='';
  username='';
  subscription : Subscription;

  form = new FormGroup({
		cf_name: new FormControl(''),
		cl_name: new FormControl(''),
		c_mobile: new FormControl(''),
		c_street: new FormControl(''),
		c_city: new FormControl(''),
		c_state: new FormControl(''),
		c_country: new FormControl(''),
		c_pin: new FormControl(''),
	});
  resultValid: boolean = false;

  constructor(private http: HttpClientModule, private profileService: EmployeeprofileService, private data : EmployeeAuthService) { }

  ngOnInit() {
    let uname :any;
    this.subscription = this.data.loginCred.subscribe( message => uname = message);
    this.username = uname.slice(13,-21)
    this.profileService.getData().subscribe(res => {
        this.f_name = res['IT_OUTPUT']['VORNA']['_text']
        this.l_name = res['IT_OUTPUT']['NACHN']['_text']
        this.mobile = res['IT_OUTPUT']['TELNR']['_text']
        this.street = res['IT_OUTPUT']['STRAS']['_text']
        this.city = res['IT_OUTPUT']['LAND']['_text']
        this.state = res['IT_OUTPUT']['ORT01']['_text']
        this.country = res['IT_OUTPUT']['NATIO']['_text']
        this.pin = res['IT_OUTPUT']['PSTLZ']['_text']
    })
  }

  onSubmit(){
    this.resultValid = true 
    this.profileService.postData(this.form.value)
  }


}
