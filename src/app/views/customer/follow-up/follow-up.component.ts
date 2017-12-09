import { DatePipe } from '@angular/common';
import { environment } from './../../../../environments/environment';
import { CustomerSourceService } from './../../../services/selects/customer-source.service';
import { UpdateComponent } from './../update/update.component';
import { AddressService } from './../../../services/selects/address.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddCustomerComponent } from '../add/add.component';
import { NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { SourceComponent } from '../source/source.component';
import { HttpService } from '../../../services/http.service'

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpCustomerComponent implements OnInit, AfterViewChecked {

  /* ------------------- 查询条件表单模型 ------------------- */
  public queryForm: FormGroup;
  public tableInfo: PageInfo = new PageInfo();

  /* --------------------- 省市区集合 ---------------------- */
  public addressItems: any[] = null;

  /* -------------------- 所属门店集合 --------------------- */
  public storeItems: any[] = [{ id: '', shopName: '请选择省市区' }];

  /* -------------------- 客户来源集合 --------------------- */
  public customerSpreadItems: any[];

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private address: AddressService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private _notification: NzNotificationService,
    private http: HttpService,
    private source: CustomerSourceService,
    private format: DatePipe
  ) {
    if (!address.addressItems.length) {
      this.http.get(`${environment.domain}/common/getAllProvinceCityArea`).then(res => {
        address.addressItems = res || [];
        this.addressItems = res || [];
      })
    } else {
      this.addressItems = address.addressItems;
    }

    if (!source.sourceItems.length) {
      this.http.post(`${environment.domain}/common/selectSpreadRelations`).then(res => {
        source.sourceItems = res.result || [];
        this.customerSpreadItems = res.result || [];
      })
    } else {
      this.customerSpreadItems = source.sourceItems
    }
  }

  ngOnInit() {
    this.queryForm = this.fb.group({
      parentPhone: [''],
      secondName: [''],
      filloutStartDate: [''],
      filloutEndDate: [''],
      customerSpreadRelationId: [''],
      activityPrice: [''],
      provinceCode: [''],
      cityCode: [''],
      areaCode: [''],
      address: [],
      shopId: [''],
      preStartDate: [''],
      preEndDate: [''],
      stage: [''],
      visitStartDate: [''],
      visitEndDate: ['']
    });

    this.query();
  }



  /* --------------------------- 根据筛选条件查询/重置 --------------------------- */
  public tableItems = [];
  query(reset = false): void {
    this.tableInfo.loading = true;
    const Params = this.queryForm.value;
    Params.pageNum = reset ? 1 : this.tableInfo.pageNum;
    Params.pageSize = this.tableInfo.pageSize;
    if (Params.filloutStartDate) Params.filloutStartDate = this.format.transform(Params.filloutStartDate, 'yyyy-MM-dd');
    if (Params.filloutEndDate) Params.filloutEndDate = this.format.transform(Params.filloutEndDate, 'yyyy-MM-dd');
    if (Params.preStartDate) Params.preStartDate = this.format.transform(Params.preStartDate, 'yyyy-MM-dd');
    if (Params.preEndDate) Params.preEndDate = this.format.transform(Params.preEndDate, 'yyyy-MM-dd');
    if (Params.visitStartDate) Params.visitStartDate = this.format.transform(Params.visitStartDate, 'yyyy-MM-dd');
    if (Params.visitEndDate) Params.visitEndDate = this.format.transform(Params.visitEndDate, 'yyyy-MM-dd');
    this.http.post(`${environment.domain}/customerDetail/selectFollowCustomerDetailList`, this.queryForm.value).then((res: any) => {
      this.tableInfo.loading = false;
      this.tableInfo.total = res.result.total;
      this.tableItems = res.result.list;
    })
  }
  resetForm(): void {
    this.queryForm.reset();
    this.queryForm.patchValue({
      parentPhone: '',
      secondName: '',
      filloutStartDate: '',
      filloutEndDate: '',
      customerSpreadRelationId: '',
      activityPrice: '',
      provinceCode: '',
      cityCode: '',
      areaCode: '',
      address: [],
      shopId: '',
      preStartDate: '',
      preEndDate: '',
      stage: '',
      visitStartDate: '',
      visitEndDate: ''
    });
    this.storeItems = [{ id: '', shopName: '请选择省市区' }];
  }

  /* ---------------------------- 约束开始/结束日期 ---------------------------- */
  _disabledStartDate1 = (startValue) => {
    if (!startValue || !this.queryForm.get('filloutEndDate').value) {
      return false;
    }
    return startValue.getTime() >= this.queryForm.get('filloutEndDate').value.getTime();
  };
  _disabledEndDate1 = (endValue) => {
    if (!endValue || !this.queryForm.get('filloutStartDate').value) {
      return false;
    }
    return endValue.getTime() < this.queryForm.get('filloutStartDate').value.getTime();
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


  /* ----------------------- 修改预约时间 ------------------------ */
  public isShowAppointment: boolean = false;
  public _date1 = '';
  public _date2: any = 0;
  public _dateItems: object[] = [{ precontractTime: '请选择', precontractId: 0 }];

  private updateItem: any;
  updateCustomerInfo(item: object): void {
    if (item['stage'] > 3) return;

    this.isShowAppointment = true;
    this.updateItem = item;

  }
  handleCancel(e) {
    this.isShowAppointment = false;
  }
  handleOk(e) {
    this.http.post(`${environment.domain}/precontractInfo/update`, {
      appointmentId: this.updateItem.appointmentId,
      precontractDate: this.format.transform(this._date1, 'yyyy-MM-dd'),
      precontractTime: this._date2,
      stage: this.updateItem['stage']
    }).then( res => {
      if(res.code == 1000){
        this.isShowAppointment = false;
        this.message.create('success', `修改客户预约时间成功`);
        this.query(true);
      } else {
        this.message.create('error', `修改客户预约时间失败`);
      }
    })
  }

  _disabledDate = function (current) {
    return current && current.getTime() < Date.now();
  };
  /* -------------------------- 监测视图变化判断日期是否发生改变 -------------------------- */
  private beforeTime: any;
  ngAfterViewChecked() {
    if (this.beforeTime !== this._date1 && this.updateItem) {
      this._date2 = 0;
      this.beforeTime = this._date1;
      this.http.post(`${environment.domain}/customerDetail/findPrecontractTimes`, {
        precontractDate: this.format.transform(this._date1, 'yyyy-MM-dd'),
        shopId: this.updateItem['shopId']
      }).then(res => {
        if (res.code == 1000) {
          this._dateItems = res.result;
        } else {
          this._dateItems = [{ precontractTime: '没有可预约时间', precontractId: -1 }]
        }
      })
    }
  }

}

/**
 * @module 分页信息
 */
export class PageInfo {
  constructor(
    public pageNum: number = 1,
    public pageSize: number = 10,
    public total: number = 0,
    public loading: boolean = false
  ) { }
}