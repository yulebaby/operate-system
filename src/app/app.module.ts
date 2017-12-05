import { AddressService } from './services/selects/address.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule, NZ_LOCALE, zhCN } from 'ng-zorro-antd';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AddCustomerComponent } from './views/customer/add/add.component';
import { BatchImportComponent } from './views/customer/batch-import/batch-import.component';
import { SourceComponent } from './views/customer/source/source.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { UpdateComponent } from './views/customer/update/update.component';
import { BaseGuard } from './base/base.guard';
import { LoginService } from './services/login.service';

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
    NewCustomerComponent,
    AddCustomerComponent,
    BatchImportComponent,
    SourceComponent,
    UpdateComponent
  ],
  entryComponents: [
    AddCustomerComponent,
    SourceComponent,
    UpdateComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [
    { provide: NZ_LOCALE, useValue: zhCN},
    AddressService,
    LoginService,
    HttpService,
    BaseGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
