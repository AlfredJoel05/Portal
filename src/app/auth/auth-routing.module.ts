import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerLoginComponent} from './customer-login/customer-login.component';

const routes: Routes = [
{path:'customerlogin', component:CustomerLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
