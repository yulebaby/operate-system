/**
 * @module 用户登录
 * @return 用户信息
 */

import { Injectable } from "@angular/core";

@Injectable()
export class LoginService {

  public userInfo: UserInfo;

  constructor() {}
}

/**
 * @module 定义用户信息
 * @param userName => 用户名
 * @param token    => 登录凭证
 * @param sex      => 性别
 * @param img      => 用户头像
 * @param role     => 角色基本
 */
export class UserInfo {
  constructor (
    public userName: string,
    public token: string,
    public sex: number,
    public img: string,
    public role: number
  ) {}
}