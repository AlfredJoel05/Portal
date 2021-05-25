import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VednorDashboardService {

  private messageSource = new BehaviorSubject(' ');
  currentMessage = this.messageSource.asObservable();
  login = 'Error';

  constructor(private httpClient: HttpClient) { }
  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/getvendorprofile`).pipe(
      map(res =>{
        var f_name = res['NAME']['_text']
        var l_name = res['NAME_2']['_text']
        console.log('Vendor Dashboard:', f_name, l_name)
        this.login = f_name + '+' +l_name
        this.messageSource.next(this.login)
        return res
    }))
  }
  // getInq(){
  //   return this.httpClient.get(`${this.SERVER}/inquiry`).pipe(map(res => {
  //   let ilen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_CUSTOMER_INQUIRY_AJ.Response'].ZSD_INQUIRYDETAILS_AJ_T.item
  //   return ilen.length
  // }))}

  // getSales(){
  //   return this.httpClient.get(`${this.SERVER}/salesorder`).pipe(map(res => {
  //   let slen = res['item']
  //   return slen.length
  // }))}

  // getDel(){
  //   return this.httpClient.get(`${this.SERVER}/delivery`).pipe(map(res => {
  //     let dlen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_DELIVERY_DETAILS.Response'].IT_DELIVERY_T.item
  //     return dlen.length
  //   }))}
}
