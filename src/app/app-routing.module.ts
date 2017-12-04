import { NewCustomerComponent } from './views/customer/new/new.component';
import { FollowUpCustomerComponent } from './views/customer/follow-up/follow-up.component';
import { MessageComponent } from './base/message/message.component';
import { WelcomeComponent } from './base/welcome/welcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { LoginComponent } from './base/login/login.component';
import { NotFountComponent } from './base/not-fount/not-fount.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: BaseComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'notfount',
        component: NotFountComponent
      },
      {
        path: 'message',
        component: MessageComponent
      },
      {
        path: 'newcustomer',
        component: NewCustomerComponent
      },
      {
        path: 'followupcustomer',
        component: FollowUpCustomerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }