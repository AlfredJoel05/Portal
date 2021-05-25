import { Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { VendorprofileService } from './vendorprofile.service'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { VendorAuthService } from '../auth/vauth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-vendorprofile',
  templateUrl: './vendorprofile.component.html',
  styleUrls: ['./vendorprofile.component.css']
})
export class VendorprofileComponent implements OnInit {
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

  constructor(private http: HttpClientModule, private profileService: VendorprofileService, private data : VendorAuthService) { }

  ngOnInit() {
    let uname :any;
    this.subscription = this.data.loginCred.subscribe( message => uname = message);
    this.username = uname.slice(13,-21)
    this.profileService.getData().subscribe(res => {
        this.f_name = res['NAME']['_text']
        this.l_name = res['NAME_2']['_text']
        this.mobile = res['TELEPHONE']['_text']
        this.street = res['STREET']['_text']
        this.city = res['CITY']['_text']
        this.state = res['REGION']['_text']
        this.country = res['COUNTRY']['_text']
        this.pin = res['POSTL_CODE']['_text']
    })
  }

  onSubmit(){ 
    this.profileService.postData(this.form.value)
  }


}
