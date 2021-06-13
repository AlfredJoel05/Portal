import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeLoginComponent } from './employee-login/employee-login.component';

const routes: Routes = [
{path:'employeelogin', component:EmployeeLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorAuthRoutingModule { }
