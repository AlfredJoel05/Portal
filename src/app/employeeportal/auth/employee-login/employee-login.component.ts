import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeAuthService } from '../eauth.service';
import { EmployeeLoaderService } from '../loader/eloader.service';
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from '../../../alert/alert.component';
import { AlertService } from '../../../alert/alert.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-login',
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.scss']
})
export class EmployeeLoginComponent implements OnInit {

  form = new FormGroup({
		username: new FormControl('', [ Validators.required ]),
		password: new FormControl('', Validators.required)
	});

	status = 'Logging in';
	result = "Invalid User";

	constructor(private loginService: EmployeeAuthService, public loaderService: EmployeeLoaderService, private router : Router, private alertService : AlertService, private dialog : MatDialog) {}

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
				this.router.navigate(['employee/dashboard']);
			}
		}
		);
	}

}
