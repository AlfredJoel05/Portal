import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeAuthService } from '../eauth.service';
import { EmployeeLoaderService } from '../loader/eloader.service';
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs';

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

	constructor(private loginService: EmployeeAuthService, public loaderService: EmployeeLoaderService, private router : Router) {}

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
				this.router.navigate(['employee/dashboard']);
			}
		}
		);
	}

}
