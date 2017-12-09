import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginServer: LoginService
  ) { 
    try {
      // const UserInfo = JSON.parse(route.queryParams['value'].userInfo);
      const UserInfo = {token: '111111'}
      if (UserInfo.token){
        this.loginServer.signIn(UserInfo);
        this.router.navigateByUrl('/home/welcome');
      }else{
        this.signIn();
      }
    } catch (error) {
      this.signIn();
    }
  }

  signIn(): void {
    console.log('去登录');
  }

  ngOnInit() {
  }

}
