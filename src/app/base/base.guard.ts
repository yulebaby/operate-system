import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class BaseGuard implements CanActivate {

  constructor(
    private login: LoginService,
    private router: Router
  ) { }

  canActivate(): boolean | Promise<boolean> {
    try {
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.login.signIn(userInfo);
      if(!userInfo){
        this.router.navigateByUrl('/login');
      }
      return !!userInfo;
    } catch (err) {
      return false;
    }
  }
}