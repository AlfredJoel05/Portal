import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeAdminLayoutRoutes } from './eadmin-layout.routing';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgTinyUrlModule } from 'ng-tiny-url';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmployeeDashboardComponent } from '../../dashboard/edashboard.component';
import { EmployeeprofileComponent } from '../../employeeprofile/employeeprofile.component';
// import { VendorpayageComponent } from '../../vendorpayage/vendorpayage.component';
import { LeaveComponent } from '../../leavedetails/leave.component';
import { DummyComponent } from '../../dummy/dummy.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeeAdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatProgressSpinnerModule,
    NgTinyUrlModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    EmployeeDashboardComponent,
    EmployeeprofileComponent,
    // VendorpayageComponent,
    LeaveComponent,
    DummyComponent,
  ]
})

export class EmployeeAdminLayoutModule {}
