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
    // { path: 'inquiry', title: 'Customer Inquiry',  icon:'objects_spaceship', class: '' },
    // { path: 'salesorder', title: 'Sales Order',  icon:'shopping_cart-simple', class: '' },
    // { path: 'delivery', title: 'Delivery Details',  icon:'shopping_delivery-fast', class: '' },
    // { path: 'payage', title: 'Payment Aging',  icon:'business_money-coins', class: '' },
    // { path: 'memo', title: 'Credit/Debit Memo',  icon:'users_single-02', class: '' },
    // { path: 'masterdata', title: 'SAP iRPA / Data Upload',  icon:'arrows-1_cloud-upload-94', class: '' },
    { path: 'vendor-profile', title: 'User Profile',  icon:'users_single-02', class: '' },
];

@Component({
  selector: 'app-vendorsidebar',
  templateUrl: './vsidebar.component.html',
  styleUrls: ['./vsidebar.component.css']
})
export class VendorSidebarComponent implements OnInit {
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
