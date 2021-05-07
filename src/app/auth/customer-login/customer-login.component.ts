import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoaderService } from '../loader/loader.service';
import { Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs';

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

	constructor(private loginService: AuthService, public loaderService: LoaderService, private router : Router) {}

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
				this.success = !!localStorage.getItem('token');
				console.log('Component Output:'+this.status);
				this.result = response; //Username is the result
				this.router.navigate(['customer/dashboard']);
			}
		}
		);
	}
}
