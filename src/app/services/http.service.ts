import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import 'rxjs/add/operator/retry';

@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) { }

  /* 配置请求头 */
  private header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  /*
  *  post/get 请求方法:
  *    接收参数
  *            1. 请求地址: string    (必填)
  *            2. 请求参数: object    (必填: 可为空)
  */
  post(url: string, query: object): Promise<any> {
    let urlAddress = url.substr(0, 4) === 'http' ? url : environment.domain + url;
    let params = query;
    params['token'] = this.loginService.userInfo.token;
    return new Promise((resolve, reject) => {
      this.http.post(urlAddress, this.serialize(params), { headers: this.header })
        .retry(1)
        .subscribe(
        res => {
          if (res['code'] == 1003) {
            this.router.navigateByUrl('/login');
          } else {
            resolve(res);
          }
        },
        err => {
          reject(err);
        }
      )
    })
  }

  get(url: string, query: object): Promise<any> {
    let urlAddress = url.substr(0, 4) === 'http' ? url : environment.domain + url;
    let params = query;
    params['token'] = this.loginService.userInfo.token;
    return new Promise((resolve, reject) => {
      this.http.get(urlAddress + '?' + this.serialize(params))
        .retry(1)
        .subscribe(
        res => {
          if (res['code'] == 1003) {
            this.router.navigateByUrl('/login');
          } else {
            resolve(res);
          }
        },
        err => {
          reject(err);
        }
      )
    })
  }

  /* 序列化请求参数 */
  serialize(data): string {
    let [val, str] = ['', ''];
    for (var v in data) {
      str = v + "=" + data[v];
      val += str + '&';
    }
    return val.slice(0, val.length - 1);
  }
}
