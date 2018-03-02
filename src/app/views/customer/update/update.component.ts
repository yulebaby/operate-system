import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { HttpService } from '../../../services/http.service';
import { AddressService } from '../../../services/selects/address.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit, AfterViewChecked {

  public validateForm: FormGroup;
  /* ------------ 集合信息 ------------ */
  public _userInfo: any;
  @Input()
  set userInfo(value: object) {
    this._userInfo = value;
  }

  /* ------------ 门店列表 ------------ */
  public stopItems: object[];

  /* ------------- 省市区 ------------- */
  public addressItems: object[];

  /* ----------- 可预约时间 ----------- */
  public timeItems: any[];

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private subject: NzModalSubject,
    private http: HttpService,
    private address: AddressService,
    private format: DatePipe
  ) {
    this.addressItems = address.addressItems;
  }

  ngOnInit() {
    const HasShop = this._userInfo.shopId;
    let required = HasShop ? [''] : ['', [Validators.required]];
    this.validateForm = this.fb.group({
      id: [this._userInfo.id],
      customerBabyId: [this._userInfo.customerBabyId],
      secondName: [this._userInfo.secondName, [Validators.required]],
      visitStage: [1],
      birthday: [this._userInfo.birthday],
      babyType: [this._userInfo.babyType, [Validators.required]],
      visitInfo: [this._userInfo.visitInfo, [Validators.required]],
      shopId: [this._userInfo.shopId],
      precontractDate: [''],
      precontractId: ['', [Validators.pattern(/^\d+$/)]],
      remark: [this._userInfo.remark],
      address: required
    })
  }


  /* -------------------------- 监测视图变化判断日期是否发生改变 -------------------------- */
  private beforeTime = '';
  ngAfterViewChecked() {
    if (this.beforeTime !== this.validateForm.get('precontractDate').value) {
      this.validateForm.patchValue({
        precontractId: ''
      })
      this.beforeTime = this.validateForm.get('precontractDate').value;
      this.http.post(`${environment.domain}/customerDetail/findPrecontractTimes`, { 
        precontractDate: this.format.transform(this.validateForm.get('precontractDate').value, 'yyyy-MM-dd'),
        shopId: this.validateForm.get('shopId').value
      }).then( res => {
        if(res.code == 1000){
          this.timeItems = res.result;
        }else{
          this.timeItems = [{ precontractTime: '没有可预约时间', precontractId: -1}]
        }
      })
    }
  }


  getFormControl(name) {
    return this.validateForm.controls[name];
  }

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    const Params = this.validateForm.value;
    Params.precontractDate = this.format.transform(this.validateForm.get('precontractDate').value, 'yyyy-MM-dd');
    Params.birthday = this.format.transform(this.validateForm.get('birthday').value, 'yyyy-MM-dd');
    if (Params.precontractId) {
      this.timeItems.map( res => {
        if (res.precontractId === Params.precontractId){
          Params.precontractTime = res.precontractTime
        }
      })
    }
    this.http.post(`${environment.domain}/customerDetail/updateCustomerPrecontractInfo`, this.validateForm.value).then( res => {
      if(res.code == 1000){
        this.subject.next('1');
      }
    })
  };

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
    }
    this.validateForm.patchValue({
      visitStage: 1
    })
  }


  /* -------------------------- 省市区联动改变事件 ------------------------- */
  _addressChange(value) {
    this.http.post(`${environment.domain}/common/findByShopObj`, {
      province: value[0] || '',
      city: value[1] || '',
      area: value[2] || ''
    }).then(res => {
      this.stopItems = res.result;
    })
  }

  /* -------------------------- selectChange ------------------------- */
  selectChange(){
    console.log(1111)
  }


  _disabledDate = function (current) {
    return current && current.getTime() < Date.now();
  };

}
