import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';
import { CustomerLoginComponent} from './customer-login/customer-login.component';


@NgModule({
  declarations: [CustomerLoginComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthRoutingModule,
  ],
  
})
export class AuthModule { }
