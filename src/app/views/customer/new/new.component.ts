import { AddressService } from './../../../services/selects/address.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddCustomerComponent } from '../add/add.component';
import { NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { SourceComponent } from '../source/source.component';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewCustomerComponent implements OnInit {

  /* ------------------- 查询条件表单模型 ------------------- */
  public queryForm: FormGroup;

  /* --------------------- 省市区集合 ---------------------- */
  public addressItems: any[] = null;

  /* -------------------- 所属门店集合 --------------------- */
  public storeItems: any[] = [{ value: 'jack', label: 'Jack' }, { value: 'lucy', label: 'Lucy' }, { value: 'disabled', label: 'Disabled', disabled: true }];


  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private Address: AddressService,
    private modalService: NzModalService,
    private _message: NzMessageService,
    private _notification: NzNotificationService,
    private http: HttpClient
  ) {
    this.addressItems = Address.addressItems;
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
      reserveTimeEnd: ['']
    });

    this.refreshData();
  }

  /* --------------------------- 根据筛选条件查询/重置 --------------------------- */
  query (): void {
    console.log(this.queryForm.value);
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
      onOk() {
      },
      onCancel() {
        console.log('Click cancel');
      },
      footer: false,
      componentParams: {
        name: '传入name值'
      }
    });
    subscription.subscribe(result => {
      console.log(result);
    })
  }

  /* ------------------------ 新增客户来源 ------------------------ */
  addCustomerSource(): void {
    const subscription = this.modalService.open({
      title: '新增客户来源',
      content: SourceComponent,
      onOk() {
      },
      onCancel() {
        console.log('Click cancel');
      },
      footer: false,
      componentParams: {
        name: '传入name值'
      }
    });
    subscription.subscribe(result => {
      console.log(result);
    })
  }

  /* ----------------------- 导入Excle表格 ----------------------- */
  upExcel(excelDome): void {
    const file = excelDome.files[0];
    if (file) {
      let message = this._message.loading('导入中, 请稍后').messageId;
      setTimeout(_ => {
        this._message.remove(message);
        this._notification.create('success', '批量导入用户信息成功', '成功 10条 失败0条 共10条');
      }, 2500)
    }
  }


  /* ------------------------ 编辑信息 ------------------------- */
  updateCustomerInfo(userInfo: object): void {
    console.log(userInfo)
  }

  /* ----------------------- 远程加载数据 ----------------------- */
  public tableItems = [];
  public randomUserUrl: string = 'https://api.randomuser.me/';
  getUsers(pageIndex = 1, pageSize = 10) {
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    return this.http.get(`${this.randomUserUrl}`, {
      params: params
    })
  }
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _loading = true;
  refreshData(reset = false): void {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this.getUsers(this._current, this._pageSize).subscribe((data: any) => {
      this._loading = false;
      this._total = 200;
      this.tableItems = data.results;
    })
  };

}

