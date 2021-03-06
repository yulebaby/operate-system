import { TreeComponent } from './tree/tree.component';
import { DatePipe } from '@angular/common';
import { environment } from './../../../environments/environment';
import { CustomerSourceService } from './../../services/selects/customer-source.service';
import { AddressService } from '../../services/selects/address.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-xiaochengxu',
  templateUrl: './xiaochengxu.component.html',
  styleUrls: ['./xiaochengxu.component.scss']
})
export class XiaochengxuComponent implements OnInit {


  customerStatus;
  /* ------------------- 查询条件表单模型 ------------------- */
  public queryForm: FormGroup;
  public tableInfo: PageInfo = new PageInfo();

  /* --------------------- 省市区集合 ---------------------- */
  public addressItems: any[] = null;

  /* -------------------- 所属门店集合 --------------------- */
  public storeItems: any[] = [{ id: '', shopName: '请选择省市区' }];

  /* -------------------- 客户来源集合 --------------------- */
  public customerSpreadItems: any[] = [
    { name: '宝妈快答', id: 10 },
    { name: '宝宝福袋', id: 11 }
  ];


  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private address: AddressService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private _notification: NzNotificationService,
    private http: HttpService,
    private source: CustomerSourceService,
    private format: DatePipe,
    private router: ActivatedRoute
  ) {
    if (!address.addressItems.length) {
      this.http.get(`${environment.domain}/common/getAllProvinceCityArea`).then(res => {
        address.addressItems = res || [];
        this.addressItems = res || [];
      })
    } else {
      this.addressItems = address.addressItems;
    }



    this.queryForm = this.fb.group({
      babySex: [''],                          // 宝宝性别
      verify: [''],                           // 是否通过手机验证
      spreadId: [''],
      phone: [''],
      createStartTime: [''],
      createEndTime: [''],
      wxCustomerAnswerState: ['']             // 领奖状态
    });

    this.query();
  }



  ngOnInit() {
  }



  /* --------------------------- 根据筛选条件查询/重置 --------------------------- */
  public tableItems = [];
  query(reset: boolean = false): void {
    this.tableInfo.loading = true;
    const Params = this.queryForm.value;
    Params.pageNum = reset ? 1 : this.tableInfo.pageNum;
    Params.pageSize = this.tableInfo.pageSize;
    if (Params.createStartTime) Params.createStartTime = this.format.transform(Params.createStartTime, 'yyyy-MM-dd');
    if (Params.createEndTime) Params.createEndTime = this.format.transform(Params.createEndTime, 'yyyy-MM-dd');
    if (Params.preStartDate) Params.preStartDate = this.format.transform(Params.preStartDate, 'yyyy-MM-dd');
    if (Params.preEndDate) Params.preEndDate = this.format.transform(Params.preEndDate, 'yyyy-MM-dd');
    if (Params.visitStartDate) Params.visitStartDate = this.format.transform(Params.visitStartDate, 'yyyy-MM-dd');
    if (Params.visitEndDate) Params.visitEndDate = this.format.transform(Params.visitEndDate, 'yyyy-MM-dd');
    this.http.post(`${environment.domain}/wxCustomerInformation/selectWxCustomerDetailList`, this.queryForm.value).then((res: any) => {
      this.tableInfo.loading = false;
      this.tableInfo.total = res.result.total;
      this.tableItems = res.result.list;
    }).catch(err => {
      this.tableInfo.loading = false;
      this.message.create('error', '网络错误, 请刷新重试');
    })
  }
  resetForm(): void {
    this.queryForm.reset();
    this.storeItems = [{ id: '', shopName: '请选择省市区' }];
  }

  /* ---------------------------- 约束开始/结束日期 ---------------------------- */
  _disabledStartDate1 = (startValue) => {
    if (!startValue || !this.queryForm.get('createEndTime').value) {
      return false;
    }
    return startValue.getTime() >= this.queryForm.get('createEndTime').value.getTime();
  };
  _disabledEndDate1 = (endValue) => {
    if (!endValue || !this.queryForm.get('createStartTime').value) {
      return false;
    }
    return endValue.getTime() < this.queryForm.get('createStartTime').value.getTime();
  };
  _disabledStartDate2 = (startValue) => {
    if (!startValue || !this.queryForm.get('preEndDate').value) {
      return false;
    }
    return startValue.getTime() >= this.queryForm.get('preEndDate').value.getTime();
  };
  _disabledEndDate2 = (endValue) => {
    if (!endValue || !this.queryForm.get('preStartDate').value) {
      return false;
    }
    return endValue.getTime() < this.queryForm.get('preStartDate').value.getTime();
  };
  _disabledStartDate3 = (startValue) => {
    if (!startValue || !this.queryForm.get('visitEndDate').value) {
      return false;
    }
    return startValue.getTime() >= this.queryForm.get('visitEndDate').value.getTime();
  };
  _disabledEndDate3 = (endValue) => {
    if (!endValue || !this.queryForm.get('visitStartDate').value) {
      return false;
    }
    return endValue.getTime() < this.queryForm.get('visitStartDate').value.getTime();
  };

  /* ---------------------- 省市区联动改变事件 ---------------------- */
  _addressChange(value) {
    this.queryForm.patchValue({
      provinceCode: value[0] || '',
      cityCode: value[1] || '',
      areaCode: value[2] || ''
    });
    if (value[0]) {
      this.http.post(`${environment.domain}/common/findByShopObj`, {
        provinceCode: value[0] || '',
        cityCode: value[1] || '',
        areaCode: value[2] || ''
      }).then(res => {
        if (res.code == 1000 && res.result.length) {
          this.storeItems = res.result;
        } else {
          this.storeItems = [{ id: '', shopName: '该城市下暂无门店' }]
        }
      })
    }
  }



  _disabledDate = function (current) {
    return current && current.getTime() < Date.now();
  };





  showTreeModal(id, name): void {
    const subscription = this.modalService.open({
      title: `${name}的关系图`,
      content: TreeComponent,
      footer: false,
      componentParams: {
        id
      }
    });
    subscription.subscribe(result => {
      if (result == 'close') {
        subscription.destroy()
      }
    })
  }






}


class PageInfo {
  constructor(
    public pageNum: number = 1,
    public pageSize: number = 10,
    public total: number = 0,
    public loading: boolean = false
  ) { }
}