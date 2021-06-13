import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class EmployeeTokenService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer xx.yy.zz'
      }
    })
    return next.handle(tokenizedReq)
  }
}
