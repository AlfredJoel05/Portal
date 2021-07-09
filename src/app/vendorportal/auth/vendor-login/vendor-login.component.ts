import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VendorAuthService } from '../vauth.service';
import { VendorLoaderService } from '../loader/vloader.service';
import { Router } from '@angular/router'
import { AlertService } from '../../../alert/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../../alert/alert.component';

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

	constructor(private loginService: VendorAuthService, private alertService : AlertService, private dialog : MatDialog, public loaderService: VendorLoaderService, private router : Router) {}

	success:boolean = this.loginService.isLoggedIn;
	ngOnInit() {}
	
	
	onSubmit() {
		var checker = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

		if (this.form.valid) {
			if(checker.test(this.form.controls.username.value)){
				this.alertService.sendMessage('Customer ID cannot contain special characters :(')
				this.alertService.changeIcon('error') //error icon 
				this.dialog.open(AlertComponent);
		  	} else {
				this.loginPostData();
			}	
		} else {
			this.alertService.sendMessage('Fill in all the required fields!')
			this.alertService.changeIcon('error') 
			this.dialog.open(AlertComponent);
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
