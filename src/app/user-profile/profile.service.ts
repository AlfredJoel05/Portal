import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }
  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/viewprofile`).pipe(
      map(res =>{ 
      return res
    }))
  }


  postData(profileData: any){
    console.log(typeof profileData)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.httpClient.post('http://localhost:3000/editprofile',profileData).subscribe(res =>{
      console.log(res)
    })
  }
}
