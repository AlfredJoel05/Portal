import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { SuccessComponent } from '../../success/success.component';
import { MatDialog } from '@angular/material/dialog';
import { SucessService } from '../../success/sucess.service';

@Injectable({
  providedIn: 'root'
})
export class VendorprofileService {

  constructor(private httpClient: HttpClient, private router : Router, private dialog : MatDialog, private successService : SucessService) { }
  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/getvendorprofile`).pipe(
      map(res =>{ 
      return res
    }))
  }


  postData(profileData: any){

    this.httpClient.post('http://localhost:3000/updatevendorprofile',profileData).subscribe(res =>{
      
      if(res === 'Success'){
        this.successService.sendMessage('Profile Updated Sucessfully')
        this.successService.changeIcon('check')
        this.dialog.open(SuccessComponent);
        this.router.navigate(['vendor/dashboard'])
      }
    
    })
  }
}
