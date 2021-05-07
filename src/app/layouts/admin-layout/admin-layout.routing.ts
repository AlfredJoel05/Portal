import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { PayageComponent } from '../../payage/payage.component';
import { InquiryComponent } from '../../inquiry/inquiry.component';
import { DeliveryComponent } from '../../delivery/delivery.component';
import { MasterdataComponent } from '../../masterdata/masterdata.component';
import { SalesorderComponent } from '../../salesorder/salesorder.component';
import { MemoComponent } from '../../memo/memo.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'payage',     component: PayageComponent },
    { path: 'inquiry',     component: InquiryComponent },
    { path: 'delivery',          component: DeliveryComponent },
    { path: 'masterdata',  component: MasterdataComponent },
    { path: 'salesorder',  component: SalesorderComponent },
    { path: 'memo',  component: MemoComponent },
];
