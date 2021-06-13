import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

import { VendorAuthRoutingModule } from './eauth-routing.module';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';


@NgModule({
  declarations: [EmployeeLoginComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    VendorAuthRoutingModule,
  ],
  
})
export class AuthModule { }
