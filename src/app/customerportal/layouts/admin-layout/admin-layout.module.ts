import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { PayageComponent } from '../../payage/payage.component';
import { MemoComponent } from '../../memo/memo.component';
import { InquiryComponent } from '../../inquiry/inquiry.component';
import { SalesorderComponent } from '../../salesorder/salesorder.component'
import { DeliveryComponent } from '../../delivery/delivery.component';
import { MasterdataComponent } from '../../masterdata/masterdata.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatProgressSpinnerModule,
    NgbModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    PayageComponent,
    InquiryComponent,
    DeliveryComponent,
    MasterdataComponent,
    SalesorderComponent,
    MemoComponent,
  ]
})

export class AdminLayoutModule {}
