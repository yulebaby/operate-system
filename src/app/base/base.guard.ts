import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class BaseGuard implements CanActivate {

  constructor(
    private login: LoginService,
    private router: Router,
    private message: NzMessageService
  ) { }

  canActivate(): boolean | Promise<boolean> {
    try {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.login.userInfo = userInfo;
      if(!userInfo){
        this.message.create('error', `请登录`)
        this.router.navigateByUrl('/login');
      }
      return !!userInfo;
    } catch (err) {
      return false;
    }
  }
}