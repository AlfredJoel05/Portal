import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';

import { AdminLayoutComponent } from './customerportal/layouts/admin-layout/admin-layout.component';
import { CustomerLoginComponent } from './customerportal/auth/customer-login/customer-login.component'
import { CustomerGuardGuard } from './customerportal/auth/customer-guard.guard';

import { VendorAdminLayoutComponent } from './vendorportal/layouts/vendor-admin-layout/vadmin-layout.component';
import { VendorLoginComponent } from './vendorportal/auth/vendor-login/vendor-login.component';
import { VendorGuardGuard } from './vendorportal/auth/vendor-guard.guard';

import { AboutComponent } from './about/about.component';

const routes: Routes =[

  { path: '', component: LandingPageComponent },

	{ path: 'customerlogin', component: CustomerLoginComponent},
	{ path:  'auth', loadChildren:  './customerportal/auth/auth.module#AuthModule' },
  { path: 'customer', component: AdminLayoutComponent, canActivate: [CustomerGuardGuard], 
    children: [
    {
      path: '',
      loadChildren: './customerportal/layouts/admin-layout/admin-layout.module#AdminLayoutModule',
    }]},

  { path: 'vendorlogin', component: VendorLoginComponent},
  { path:  'auth', loadChildren:  './vendorportal/auth/vauth.module#AuthModule' },
  { path: 'vendor', component: VendorAdminLayoutComponent, canActivate: [VendorGuardGuard], 
    children: [
    {
      path: '',
      loadChildren: './vendorportal/layouts/vendor-admin-layout/vadmin-layout.module#VendorAdminLayoutModule',
    }]},
        


  { path: 'about', component: AboutComponent },
    
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
