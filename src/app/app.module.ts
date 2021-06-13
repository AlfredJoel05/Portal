import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CustomerLoginComponent } from './customerportal/auth/customer-login/customer-login.component';
import { CustomerGuardGuard } from './customerportal/auth/customer-guard.guard';
import { TokenService } from './customerportal/auth/tokenInterceptor/token.service';
import { ComponentsModule } from './customerportal/components/components.module';
import { InterceptorService } from './customerportal/auth/loader/interceptor.service';
import { CustomerProfileComponent } from './customerportal/customer-profile/customer-profile.component';
import { AdminLayoutComponent } from './customerportal/layouts/admin-layout/admin-layout.component';

import { VendorLoginComponent } from './vendorportal/auth/vendor-login/vendor-login.component';
import { VendorGuardGuard } from './vendorportal/auth/vendor-guard.guard';
import { VendorTokenService } from './vendorportal/auth/tokenInterceptor/token.service';
import { VendorComponentsModule } from './vendorportal/components/vcomponents.module'
import { VendorInterceptorService } from './vendorportal/auth/loader/vinterceptor.service'
import { VendorAdminLayoutComponent } from './vendorportal/layouts/vendor-admin-layout/vadmin-layout.component';

import { EmployeeLoginComponent } from './employeeportal/auth/employee-login/employee-login.component';
import { EmployeeGuardGuard } from './employeeportal/auth/employee-guard.guard';
import { EmployeeTokenService } from './employeeportal/auth/tokenInterceptor/token.service';
import { EmployeeComponentsModule } from './employeeportal/components/ecomponents.module'
import { EmployeeInterceptorService } from './employeeportal/auth/loader/einterceptor.service'
import { EmployeeAdminLayoutComponent } from './employeeportal/layouts/employee-admin-layout/eadmin-layout.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    VendorComponentsModule,
    EmployeeComponentsModule,
    RouterModule,
    MatProgressBarModule,
    AppRoutingModule,
    NgbModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    VendorAdminLayoutComponent,
    AboutComponent,
    CustomerProfileComponent,
    LandingPageComponent,
    CustomerLoginComponent,
    VendorLoginComponent,
    EmployeeLoginComponent,
    EmployeeAdminLayoutComponent,
  ],
  providers: [
    { provide:HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    { provide:HTTP_INTERCEPTORS, useClass: VendorInterceptorService, multi: true},
    { provide:HTTP_INTERCEPTORS, useClass: EmployeeInterceptorService, multi: true},
    { provide:HTTP_INTERCEPTORS, useClass: TokenService, multi: true},
    { provide:HTTP_INTERCEPTORS, useClass: VendorTokenService, multi: true},
    { provide:HTTP_INTERCEPTORS, useClass: EmployeeTokenService, multi: true},
    CustomerGuardGuard, 
    VendorGuardGuard,
    EmployeeGuardGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
