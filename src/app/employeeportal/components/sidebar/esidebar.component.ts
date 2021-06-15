import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: 'leavedetails', title: 'Leave Details',  icon:'shopping_cart-simple', class: '' },
    { path: 'payslip', title: 'Payslip Details',  icon:'users_single-02', class: '' },
    { path: 'finalsettle', title: 'Final Settlement',  icon:'business_money-coins', class: '' },
    { path: 'employee-profile', title: 'User Profile',  icon:'users_single-02', class: '' },
];

@Component({
  selector: 'app-employeesidebar',
  templateUrl: './esidebar.component.html',
  styleUrls: ['./esidebar.component.css']
})
export class EmployeeSidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
