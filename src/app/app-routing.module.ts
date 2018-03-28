import { DetailsComponent } from './views/xiaochengxu/details/details.component';
import { XiaochengxuComponent } from './views/xiaochengxu/xiaochengxu.component';
import { BaseGuard } from './base/base.guard';
import { CustomerComponent } from './views/customer/customer.component';
import { FollowUpCustomerComponent } from './views/customer/follow-up/follow-up.component';
import { MessageComponent } from './base/message/message.component';
import { WelcomeComponent } from './base/welcome/welcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { LoginComponent } from './base/login/login.component';
import { NotFountComponent } from './base/not-fount/not-fount.component';
import { ContentGuard } from './base/content/content.guard';

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
    canActivate: [BaseGuard],
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
        path: 'customer/:type',
        component: CustomerComponent
      },
      {
        path: 'xiaochengxu',
        component: XiaochengxuComponent
      },
      {
        path: 'details/:id',
        component: DetailsComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'home/notfount',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }