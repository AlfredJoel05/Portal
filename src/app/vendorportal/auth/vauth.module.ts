import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

import { VendorAuthRoutingModule } from './vauth-routing.module';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';


@NgModule({
  declarations: [VendorLoginComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    VendorAuthRoutingModule,
  ],
  
})
export class AuthModule { }
