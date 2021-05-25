import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { VendorAuthService } from './vauth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorGuardGuard implements CanActivate {

  constructor(private router: Router, private authService : VendorAuthService) {}

  canActivate() {
      if (this.authService.isLoggedIn)
      {
        return !!sessionStorage.getItem('token');
      }
      else{
      this.router.navigate(['vendorlogin'])
      return false;
      }
    }
  }
  

    
