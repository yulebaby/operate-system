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
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpCustomerComponent implements OnInit {

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
      status: ['1,2,3']
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
  resetForm(): void {
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
    this.http.post(`${environment.domain}/common/findByShopObj`, {
      province: value[0] || '',
      city: value[1] || '',
      area: value[2] || ''
    }).then(res => {
      console.log(res)
      if (res.code == 1000) {
        this.storeItems = res.result;
      } else {
        this.storeItems = [{ value: null, label: '该城市下暂无门店' }]
      }
    })
  }

  /* ----------------------- 获取电话号码 ------------------------ */
  getPhone(item): void {
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