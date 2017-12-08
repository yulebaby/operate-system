import { HttpService } from './../http.service';
/**
 * @module 省市区三级联动
 * @return 省市区集合
 */
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable()
export class AddressService {

  public addressItems: object[] = [];
  
  constructor () { }

 }