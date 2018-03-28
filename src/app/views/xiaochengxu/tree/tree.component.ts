import { Router } from '@angular/router';
import { HttpService } from './../../../services/http.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  _id;

  nodes: any[] = [];

  @Input()
  set id(value: string | number) {
    this._id = value;
  }

  constructor(
    private http: HttpService,
    private router: Router,
    private subject: NzModalSubject
  ) { }

  ngOnInit() {
    this.getChildren(this._id).then(res => {
      this.nodes = this.nodes.concat(res);
    })
  }

  getChildren(wxCustomerId): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.http.post('/wxCustomerInformation/selectWxCustomerFissionList', { wxCustomerId }).then(res => {
        if (res.code == 1000 && res.result.length) {
          res.result.map(item => {
            item.name = item.nickName;
            item.hasChildren = item.conversionNumber > 0;
          });
          resolve(res.result);
        } else {
          resolve([]);
        }
      })
    })
  }


  options = {
    getChildren: (node: any) => {
      return new Promise((resolve, reject) => {
        this.getChildren(node.data.wxCustomerId).then( res => {
          resolve(res);
        });
      });
    }
  };

  onEvent(ev: any) {
    if (ev.eventName === 'focus'){
      this.subject.next('close');
      this.router.navigate(['/home/details', ev.node.data.wxCustomerId])
    }
  }

}
