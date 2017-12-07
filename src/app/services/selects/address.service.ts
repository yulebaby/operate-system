/**
 * @module 省市区三级联动
 * @return 省市区集合
 */
import { Injectable } from "@angular/core";

@Injectable()
export class AddressService {
  public addressItems: object[] = [{
    value: '110000',
    label: '北京直辖市',
    children: [{
      value: '110100',
      label: '北京市',
      children: [{
        value: '110105',
        label: '朝阳区',
        isLeaf: true
      }],
    }],
  }];
  constructor () {}
 }