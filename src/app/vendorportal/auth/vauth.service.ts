import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from  'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class VendorAuthService {

  loginPost$: Observable<any>;
  private loginPostSubject = new Subject<any>();
  SERVER = "http://localhost:3000";

  isLoggedIn: boolean = false; // Default Value : false -- True for testing purposes

  private logincred = new BehaviorSubject<string>("default Message");
	loginCred = this.logincred.asObservable();

  constructor(private httpClient: HttpClient , private router : Router) {
    this.loginPost$ = this.loginPostSubject.asObservable();
   }

  loginPostData(loginData: any){

    this.loginPostSubject.next(loginData);
    this.logincred.next(JSON.stringify(loginData));

		console.log('Login Cred in vauthservice: '+ this.loginCred)
    return this.httpClient.post(`${this.SERVER}/vendorlogin`, loginData).pipe(
      map(response =>{ 
        if(response !== "UNUS" && response !== "WP")
		    {
          let res = JSON.stringify(response)
          let token = res.split(':::::')[0]
          token = token.slice(1)
          let username = res.split(':::::')[1]
          username = username.slice(0, username.length - 1)	
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('username', username)
          this.isLoggedIn = true;
          return username;
			  }
        else if(response === "UNUS"){
          alert("User Unregistered");
          return "NULL";
        }
        else {
          alert("Incorrect VendorID or Password");
          return "NULL";
        }
	  })
    )
  }
}