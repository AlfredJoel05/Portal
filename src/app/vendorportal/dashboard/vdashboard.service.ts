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
        this.login = f_name + '+' +l_name
        sessionStorage.setItem('fullname', f_name+' '+l_name)
        this.messageSource.next(this.login)
        return res
    }))
  }
  getInq(){
    return this.httpClient.get(`${this.SERVER}/vendorrequest`).pipe(map(res => {
    let ilen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_RFQ.Response'].T_RFQ_HEADER.item
    sessionStorage.setItem('Ilen',ilen.length)
    return ilen.length
  }))}

  getSales(){
    return this.httpClient.get(`${this.SERVER}/goodsreceipt`).pipe(map(res => {
    let slen = res['T_GOODSMVT_HEADER']['item']
    sessionStorage.setItem('Slen', slen.length)
    return slen.length
  }))}

  getDel(){
    return this.httpClient.get(`${this.SERVER}/vendorpurchase`).pipe(map(res => {
      let dlen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PURCHASE.Response'].T_PO_HEADER.item
      sessionStorage.setItem('Dlen',dlen.length)
      return dlen.length
    }))}
}
