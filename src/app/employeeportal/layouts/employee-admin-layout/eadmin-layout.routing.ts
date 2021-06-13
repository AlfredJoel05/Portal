import { Routes } from '@angular/router';

import { EmployeeDashboardComponent } from '../../dashboard/edashboard.component';
import { EmployeeprofileComponent } from '../../employeeprofile/employeeprofile.component';
import { VendorpayageComponent } from '../../vendorpayage/vendorpayage.component';
import { LeaveComponent } from '../../leavedetails/leave.component';
import { DummyComponent } from '../../dummy/dummy.component';
// import { VendorpurchaseComponent } from '../../vendorpurchase/vendorpurchase.component'

export const EmployeeAdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: EmployeeDashboardComponent },
    { path: 'employee-profile',   component: EmployeeprofileComponent },
    { path: 'payage',     component: VendorpayageComponent },
    { path: 'leavedetails',  component: LeaveComponent },
    { path: 'dummy',  component: DummyComponent },
];
