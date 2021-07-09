import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoaderService } from '../loader/loader.service';
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../../alert/alert.component';
import { AlertService } from '../../../alert/alert.service';

@Component({
	selector: 'app-customer-login',
	templateUrl: './customer-login.component.html',
	styleUrls: [ './customer-login.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class CustomerLoginComponent implements OnInit {
	
	form = new FormGroup({
		username: new FormControl('', [ Validators.required ]),
		password: new FormControl('', Validators.required)
	});

	status = 'Logging in';
	result = "Invalid User";

	constructor(private loginService: AuthService, public loaderService: LoaderService, private router : Router, private dialog: MatDialog, private alertService : AlertService) {}

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
				this.router.navigate(['customer/dashboard']);
			}
		}
		);
	}
}
