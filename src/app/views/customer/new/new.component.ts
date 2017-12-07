import { environment } from './../../../../environments/environment';
import { CustomerSourceService } from './../../../services/selects/customer-source.service';
import { UpdateComponent } from './../update/update.component';
import { AddressService } from './../../../services/selects/address.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddCustomerComponent } from '../add/add.component';
import { NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { SourceComponent } from '../source/source.component';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewCustomerComponent implements OnInit {

  /* ------------------- 查询条件表单模型 ------------------- */
  public queryForm: FormGroup;
  public tableInfo: PageInfo = new PageInfo();

  /* --------------------- 省市区集合 ---------------------- */
  public addressItems: any[] = null;

  /* -------------------- 所属门店集合 --------------------- */
  public storeItems: any[] = [{ value: 'jack', label: 'Jack' }, { value: 'lucy', label: 'Lucy' }, { value: 'disabled', label: 'Disabled', disabled: true }];


  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private address: AddressService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private _notification: NzNotificationService,
    private http: HttpService,
    private source: CustomerSourceService
  ) {
    this.addressItems = address.addressItems;
  }

  ngOnInit() {
    this.queryForm = this.fb.group({
      phone: [''],
      name: [''],
      createTimeStart: [''],
      createTimeEnd: [''],
      source: [''],
      priceStart: [''],
      priceEnd: [''],
      province: [''],
      city: [''],
      area: [''],
      address: [],
      store: [''],
      reserveTimeStart: [''],
      reserveTimeEnd: [''],
      status: ['']
    });

    this.query();
  }

  /* --------------------------- 根据筛选条件查询/重置 --------------------------- */
  public tableItems = [];
  query(reset = false): void {
    this.tableInfo.loading = true;
    const Params = this.queryForm.value;
    Params.pageNo = reset ? 1 : this.tableInfo.pageNo;
    Params.pageSize = this.tableInfo.pageSize;
    this.http.post(`${environment.domain}/customerDetail/selectCustomerDetailList`, this.queryForm.value).then((res: any) => {
      this.tableInfo.loading = false;
      this.tableInfo.total = res.result.total;
      this.tableItems = res.result.list;
    })
  }
  resetForm (): void {
    this.queryForm.reset();
  }

  /* ---------------------------- 约束开始/结束日期 ---------------------------- */
  _disabledStartDate1 = (startValue) => {
    if (!startValue || !this.queryForm.get('createTimeEnd').value) {
      return false;
    }
    return startValue.getTime() >= this.queryForm.get('createTimeEnd').value.getTime();
  };
  _disabledEndDate1 = (endValue) => {
    if (!endValue || !this.queryForm.get('createTimeStart').value) {
      return false;
    }
    return endValue.getTime() <= this.queryForm.get('createTimeStart').value.getTime();
  };
  _disabledStartDate2 = (startValue) => {
    if (!startValue || !this.queryForm.get('reserveTimeEnd').value) {
      return false;
    }
    return startValue.getTime() >= this.queryForm.get('reserveTimeEnd').value.getTime();
  };
  _disabledEndDate2 = (endValue) => {
    if (!endValue || !this.queryForm.get('reserveTimeStart').value) {
      return false;
    }
    return endValue.getTime() <= this.queryForm.get('reserveTimeStart').value.getTime();
  };

  /* ---------------------- 省市区联动改变事件 ---------------------- */
  _addressChange(value) {
    this.queryForm.patchValue({
      province: value[0] || '',
      city: value[1] || '',
      area: value[2] || ''
    });
  }

  /* ------------------------ 新增客户信息 ------------------------ */
  addCustomerInfo(): void {
    const subscription = this.modalService.open({
      title: '新增客户信息',
      content: AddCustomerComponent,
      footer: false,
    });
    subscription.subscribe(result => {
      if(result === true){
        this.message.create('success', `新增用户信息成功`)
        subscription.destroy();
      }
    })
  }

  /* ------------------------ 新增客户来源 ------------------------ */
  addCustomerSource(): void {
    const subscription = this.modalService.open({
      title: '新增客户来源',
      content: SourceComponent,
      footer: false,
    });
    subscription.subscribe(result => {
      if (result === true) {
        this.message.create('success', `新增用户信息成功`)
        subscription.destroy();
      }
    })
  }

  /* ----------------------- 导入Excle表格 ----------------------- */
  upExcel(excelDome): void {
    const file = excelDome.files[0];
    if (file) {
      let message = this.message.loading('导入中, 请稍后').messageId;
      setTimeout(_ => {
        this.message.remove(message);
        this._notification.create('success', '批量导入用户信息成功', '成功 10条 失败0条 共10条');
      }, 2500)
    }
  }


  /* ------------------------- 编辑信息 -------------------------- */
  updateCustomerInfo(userInfo: object): void {
    const subscription = this.modalService.open({
      title: '修改客户信息',
      content: UpdateComponent,
      footer: false,
      componentParams: {
        userInfo: userInfo
      }
    });
    subscription.subscribe(result => {
      if (result === true) {
        this.message.create('success', `客户预约成功`)
        subscription.destroy();
      }
    })
  }

  /* ----------------------- 获取电话号码 ------------------------ */
  getPhone (item): void {
    this.http.post(`${environment.domain}/customerDetail/findByParentPhone`, { customerBabyId: item.customerBabyId }).then(res => {
      this.tableItems.map(data => {
        if (data.id === item.id) {
          data.checkPhone = res.result;
        }
      })
    })
  }

}

/**
 * @module 分页信息
 */
export class PageInfo {
  constructor(
    public pageNo: number = 1,
    public pageSize: number = 10,
    public total: number = 0,
    public loading: boolean = false
  ) { }
}