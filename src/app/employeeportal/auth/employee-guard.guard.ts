import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EmployeeAuthService } from './eauth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuardGuard implements CanActivate {

  constructor(private router: Router, private authService : EmployeeAuthService) {}

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
  

    
