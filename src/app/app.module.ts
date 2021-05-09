import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { CustomerLoginComponent } from './auth/customer-login/customer-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { InterceptorService } from './auth/loader/interceptor.service';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomerGuardGuard } from './auth/customer-guard.guard';
import { TokenService } from './auth/tokenInterceptor/token.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
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
    AboutComponent,
    CustomerProfileComponent,
    LandingPageComponent,
    CustomerLoginComponent
  ],
  providers: [
    { provide:HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    { provide:HTTP_INTERCEPTORS, useClass: TokenService, multi: true},
    CustomerGuardGuard, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
