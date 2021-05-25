import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendorNavService {

  constructor(private httpClient: HttpClient) { }

  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/getvendorprofile`).pipe(
      map(res =>{ 
      return res
    }))
  }
}
