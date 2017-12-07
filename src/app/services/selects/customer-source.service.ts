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

  constructor(
    private http: HttpService
  ) {
    this.getSource();
  }

  async getSource() {
    if (!this.sourceItems.length) {
      let res: any = await this.http.post(`${environment.domain}/common/selectSpreadRelations`);
      if (res.code == 1000) {
        this.sourceItems = res.result;
      }
    }
  }

}