import { Component, Input, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { ProfileService } from './profile.service'
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../auth/auth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

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

  constructor(private http: HttpClientModule, private profileService: ProfileService, private data : AuthService) { }

  ngOnInit() {
    let uname :any;
    this.subscription = this.data.loginCred.subscribe( message => uname = message);
    this.username = uname.slice(13,-21)
    this.profileService.getData().subscribe(res => {
        this.f_name = res['NAME1']['_text']
        this.l_name = res['NAME2']['_text']
        this.mobile = res['MOBILE']['_text']
        this.street = res['STREET']['_text']
        this.city = res['CITY']['_text']
        this.state = res['STATE']['_text']
        this.country = res['COUNTRY']['_text']
        this.pin = res['PINCODE']['_text']
    })
  }

  onSubmit(){
    console.log(this.form.value)
    
    this.profileService.postData(this.form.value)
  }

}
