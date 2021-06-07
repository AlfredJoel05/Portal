import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { VendorNavbarComponent } from './navbar/vnavbar.component';
import { VendorSidebarComponent } from './sidebar/vsidebar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    VendorNavbarComponent,
    VendorSidebarComponent,
    FooterComponent
    
  ],
  exports: [
    VendorNavbarComponent,
    VendorSidebarComponent,
    FooterComponent
  ]
})
export class VendorComponentsModule { }
