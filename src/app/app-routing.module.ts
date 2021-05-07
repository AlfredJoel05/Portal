import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import{ CustomerLoginComponent } from './auth/customer-login/customer-login.component'
import { AboutComponent } from './about/about.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component'
import { CustomerGuardGuard } from './auth/customer-guard.guard';

const routes: Routes =[

  { path: '', component: LandingPageComponent },
	{ path: 'customerlogin', component: CustomerLoginComponent},
	{ path: 'about', component: AboutComponent },
	{ path:  'auth', loadChildren:  './auth/auth.module#AuthModule' },
	// { path: '**', redirectTo:'' },

  {path: 'customer', component: AdminLayoutComponent, canActivate: [CustomerGuardGuard], 
    children: [
    {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
    }]},
    
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
