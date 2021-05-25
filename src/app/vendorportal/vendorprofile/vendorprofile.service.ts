import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class VendorprofileService {

  constructor(private httpClient: HttpClient, private router : Router) { }
  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/getvendorprofile`).pipe(
      map(res =>{ 
      return res
    }))
  }


  postData(profileData: any){
    console.log(typeof profileData)

    this.httpClient.post('http://localhost:3000/updatevendorprofile',profileData).subscribe(res =>{
      
      if(res === 'Success'){
        console.log('Edit Profile:'+res)
        this.router.navigate(['vendor/dashboard'])
      }
    
    })
  }
}
