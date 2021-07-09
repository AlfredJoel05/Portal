import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { SucessService } from '../../success/sucess.service';
import { SuccessComponent } from '../../success/success.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeprofileService {

  constructor(private httpClient: HttpClient, private router : Router, private dialog : MatDialog, private successService : SucessService) { }
  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/getempprofile`).pipe(
      map(res =>{ 
      return res
    }))
  }


  postData(profileData: any){
    console.log('EMP PROFLE SERVICE')

    this.httpClient.post('http://localhost:3000/updateempprofile',profileData).subscribe(res =>{
      
      if(res === 'Success'){
        this.successService.sendMessage('Profile Updated Sucessfully')
        this.successService.changeIcon('check')
        this.dialog.open(SuccessComponent);
        this.router.navigate(['vendor/dashboard'])
      }
      else{
        alert('There is an Error while processing your request')
      }
    
    })
  }
}
