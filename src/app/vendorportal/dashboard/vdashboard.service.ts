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
  getInq(){
    return this.httpClient.get(`${this.SERVER}/vendorrequest`).pipe(map(res => {
    let ilen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_RFQ.Response'].T_RFQ_HEADER.item
    return ilen.length
  }))}

  getSales(){
    return this.httpClient.get(`${this.SERVER}/goodsreceipt`).pipe(map(res => {
    let slen = res['T_GOODSMVT_HEADER']['item']
    return slen.length
  }))}

  getDel(){
    return this.httpClient.get(`${this.SERVER}/vendorpurchase`).pipe(map(res => {
      let dlen = res['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_PURCHASE.Response'].T_PO_HEADER.item
      return dlen.length
    }))}
}
