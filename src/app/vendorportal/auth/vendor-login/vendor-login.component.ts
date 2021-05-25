import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VendorAuthService } from '../vauth.service';
import { VendorLoaderService } from '../loader/vloader.service';
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.scss']
})
export class VendorLoginComponent implements OnInit {

  form = new FormGroup({
		username: new FormControl('', [ Validators.required ]),
		password: new FormControl('', Validators.required)
	});

	status = 'Logging in';
	result = "Invalid User";

	constructor(private loginService: VendorAuthService, public loaderService: VendorLoaderService, private router : Router) {}

	success:boolean = this.loginService.isLoggedIn;
	ngOnInit() {}
	
	
	onSubmit() {
		if (this.form.valid) {
			this.loginPostData();
		} else {
			alert('Fill in the required Fields');
		}
	}

	loginPostData() {
		this.loginService.loginPostData(this.form.value).subscribe(response => {
			if(response !== "NULL")
			{
				this.success = !!sessionStorage.getItem('token');
				this.result = response; //Username is the result
				this.router.navigate(['vendor/dashboard']);
			}
		}
		);
	}

}
