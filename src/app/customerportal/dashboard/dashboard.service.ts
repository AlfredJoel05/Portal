import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private messageSource = new BehaviorSubject(' ');
  currentMessage = this.messageSource.asObservable();
  login = 'Error';

  constructor(private httpClient: HttpClient) { }
  SERVER = "http://localhost:3000";

  getData(){
    return this.httpClient.get(`${this.SERVER}/viewprofile`).pipe(
      map(res =>{
        var f_name = res['NAME1']['_text']
        var l_name = res['NAME2']['_text']
        this.login = f_name + '+' +l_name
        this.messageSource.next(this.login)
        return res
    }))
  }
  getInq(){
    return this.httpClient.get(`${this.SERVER}/inquiry`).pipe(map(res => {
    var ilen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_CUSTOMER_INQUIRY_AJ.Response'].ZSD_INQUIRYDETAILS_AJ_T.item
    sessionStorage.setItem('Ilen',ilen.length)
    return ilen.length
  }))}

  getSales(){
    return this.httpClient.get(`${this.SERVER}/salesorder`).pipe(map(res => {
    var slen = res['item']
    sessionStorage.setItem('Slen', slen.length)
    return slen.length
  }))}

  getDel(){
    return this.httpClient.get(`${this.SERVER}/delivery`).pipe(map(res => {
      var dlen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_DELIVERY_DETAILS.Response'].IT_DELIVERY_T.item
      sessionStorage.setItem('Dlen',dlen.length)
      return dlen.length
    }))}
}
