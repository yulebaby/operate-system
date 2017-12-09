/**
 * @module 客户来源
 * @return 来源集合<Array>
 */

import { Injectable } from "@angular/core";
import { HttpService } from '../http.service';
import { environment } from '../../../environments/environment';
import { resolve } from "../../../../node_modules/_@types_q@0.0.32@@types/q";

@Injectable()
export class CustomerSourceService {
  
  public sourceItems: object[] = [];

  constructor() {}

}