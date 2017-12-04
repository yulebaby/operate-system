import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from './base/base.component';
import { HeaderComponent } from './base/header/header.component';
import { MenuComponent } from './base/menu/menu.component';
import { ContentComponent } from './base/content/content.component';
import { FooterComponent } from './base/footer/footer.component';
import { WelcomeComponent } from './base/welcome/welcome.component';
import { LoginComponent } from './base/login/login.component';
import { NotFountComponent } from './base/not-fount/not-fount.component';
import { MessageComponent } from './base/message/message.component';
import { FollowUpCustomerComponent } from './views/customer/follow-up/follow-up.component';
import { NewCustomerComponent } from './views/customer/new/new.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    HeaderComponent,
    MenuComponent,
    ContentComponent,
    FooterComponent,
    WelcomeComponent,
    LoginComponent,
    NotFountComponent,
    MessageComponent,
    FollowUpCustomerComponent,
    NewCustomerComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
