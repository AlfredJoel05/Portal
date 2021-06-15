import { Routes } from '@angular/router';

import { EmployeeDashboardComponent } from '../../dashboard/edashboard.component';
import { EmployeeprofileComponent } from '../../employeeprofile/employeeprofile.component';
import { EmployeePayslipComponent } from '../../payslip/employeepayslip.component';
import { LeaveComponent } from '../../leavedetails/leave.component';
import { DummyComponent } from '../../dummy/dummy.component';
import { FinalSettleComponent } from '../../finalsettlement/fs.component'

export const EmployeeAdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: EmployeeDashboardComponent },
    { path: 'employee-profile',   component: EmployeeprofileComponent },
    { path: 'payslip',     component: EmployeePayslipComponent },
    { path: 'leavedetails',  component: LeaveComponent },
    { path: 'finalsettle',  component: FinalSettleComponent },
    { path: 'dummy',  component: DummyComponent },
];
