import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EmployeeNavbarComponent } from './navbar/enavbar.component';
import { EmployeeSidebarComponent } from './sidebar/esidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    EmployeeNavbarComponent,
    EmployeeSidebarComponent,
    
  ],
  exports: [
    EmployeeNavbarComponent,
    EmployeeSidebarComponent,
  ]
})
export class EmployeeComponentsModule { }
