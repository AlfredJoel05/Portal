import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerGuardGuard implements CanActivate {

  constructor(private router: Router, private authService : AuthService) {}

  canActivate() {
      if (this.authService.isLoggedIn)
      {
        console.log('CanActivate: '+!!localStorage.getItem('token'))
        return !!localStorage.getItem('token');
      }
      this.router.navigate(['customerlogin'])
      return false;
    }
  }
  

    
