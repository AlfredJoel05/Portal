import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorAdminLayoutRoutes } from './vadmin-layout.routing';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { VendorDashboardComponent } from '../../dashboard/vdashboard.component';
import { VendorprofileComponent } from '../../vendorprofile/vendorprofile.component';
// import { PayageComponent } from '../../payage/payage.component';
// import { MemoComponent } from '../../memo/memo.component';
// import { InquiryComponent } from '../../inquiry/inquiry.component';
// import { SalesorderComponent } from '../../salesorder/salesorder.component'
// import { DeliveryComponent } from '../../delivery/delivery.component';
// import { MasterdataComponent } from '../../masterdata/masterdata.component';
import { DummyComponent } from '../../dummy/dummy.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VendorAdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatProgressSpinnerModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    VendorDashboardComponent,
    VendorprofileComponent,
    // PayageComponent,
    // InquiryComponent,
    // DeliveryComponent,
    // MasterdataComponent,
    // SalesorderComponent,
    // MemoComponent,
    DummyComponent,
  ]
})

export class VendorAdminLayoutModule {}
