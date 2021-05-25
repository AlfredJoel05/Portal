import { Routes } from '@angular/router';

import { VendorDashboardComponent } from '../../dashboard/vdashboard.component';
import { VendorprofileComponent } from '../../vendorprofile/vendorprofile.component';
// import { PayageComponent } from '../../payage/payage.component';
// import { InquiryComponent } from '../../inquiry/inquiry.component';
// import { DeliveryComponent } from '../../delivery/delivery.component';
// import { MasterdataComponent } from '../../masterdata/masterdata.component';
// import { SalesorderComponent } from '../../salesorder/salesorder.component';
import { VendormemoComponent } from '../../vendormemo/vendormemo.component';
import { DummyComponent } from '../../dummy/dummy.component';

export const VendorAdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: VendorDashboardComponent },
    { path: 'vendor-profile',   component: VendorprofileComponent },
    // { path: 'payage',     component: PayageComponent },
    // { path: 'inquiry',     component: InquiryComponent },
    // { path: 'delivery',          component: DeliveryComponent },
    // { path: 'masterdata',  component: MasterdataComponent },
    // { path: 'salesorder',  component: SalesorderComponent },
    { path: 'memo',  component: VendormemoComponent },
    { path: 'dummy',  component: DummyComponent },
];
