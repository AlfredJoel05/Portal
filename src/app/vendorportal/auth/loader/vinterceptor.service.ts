import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VendorLoaderService } from './vloader.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VendorInterceptorService implements HttpInterceptor{

  constructor(public loaderService: VendorLoaderService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);
    
    return next.handle(req).pipe(
      finalize( () =>{
          this.loaderService.isLoading.next(false);
        }))
    
    
  }
}


