/**
 * @module 省市区三级联动
 * @return 省市区集合
 */
import { Injectable } from "@angular/core";

@Injectable()
export class AddressService {
  public addressItems: object[] = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
      value: 'hangzhou',
      label: 'Hangzhou',
      children: [{
        value: 'xihu',
        label: 'West Lake',
        isLeaf: true
      }],
    }, {
      value: 'ningbo',
      label: 'Ningbo',
      isLeaf: true
    }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
          isLeaf: true
        }],
      }],
    }];;
  constructor () {}
 }