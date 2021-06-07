import { Routes } from '@angular/router';

import { VendorDashboardComponent } from '../../dashboard/vdashboard.component';
import { VendorprofileComponent } from '../../vendorprofile/vendorprofile.component';
import { VendorpayageComponent } from '../../vendorpayage/vendorpayage.component';
// import { InquiryComponent } from '../../inquiry/inquiry.component';
// import { DeliveryComponent } from '../../delivery/delivery.component';
import { VendorformComponent } from '../../vendorform/vendorform.component';
import { GoodsreceiptComponent } from '../../goodsreceipt/goodsreceipt.component';
import { VendormemoComponent } from '../../vendormemo/vendormemo.component';
import { DummyComponent } from '../../dummy/dummy.component';
import { VendorpurchaseComponent } from '../../vendorpurchase/vendorpurchase.component'
import { VendorrequestComponent } from '../../vendorrequest/vendorrequest.component'

export const VendorAdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: VendorDashboardComponent },
    { path: 'vendor-profile',   component: VendorprofileComponent },
    { path: 'payage',     component: VendorpayageComponent },
    { path: 'request',     component: VendorrequestComponent },
    { path: 'purchase',          component: VendorpurchaseComponent },
    { path: 'invoice',  component: VendorformComponent },
    { path: 'goodsreceipt',  component: GoodsreceiptComponent },
    { path: 'memo',  component: VendormemoComponent },
    { path: 'dummy',  component: DummyComponent },
];
