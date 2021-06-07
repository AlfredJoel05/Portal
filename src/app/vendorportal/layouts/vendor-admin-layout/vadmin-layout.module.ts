import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorAdminLayoutRoutes } from './vadmin-layout.routing';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgTinyUrlModule } from 'ng-tiny-url';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { VendorDashboardComponent } from '../../dashboard/vdashboard.component';
import { VendorprofileComponent } from '../../vendorprofile/vendorprofile.component';
import { VendorpayageComponent } from '../../vendorpayage/vendorpayage.component';
import { VendormemoComponent } from '../../vendormemo/vendormemo.component';
import { GoodsreceiptComponent } from '../../goodsreceipt/goodsreceipt.component';
import { VendorpurchaseComponent } from '../../vendorpurchase/vendorpurchase.component'
import { VendorrequestComponent } from '../../vendorrequest/vendorrequest.component'
import { VendorformComponent } from '../../vendorform/vendorform.component';
import { DummyComponent } from '../../dummy/dummy.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VendorAdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatProgressSpinnerModule,
    NgTinyUrlModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    VendorDashboardComponent,
    VendorprofileComponent,
    VendorpayageComponent,
    VendorpurchaseComponent,
    VendorrequestComponent,
    VendorformComponent,
    GoodsreceiptComponent,
    VendormemoComponent,
    DummyComponent,
  ]
})

export class VendorAdminLayoutModule {}
