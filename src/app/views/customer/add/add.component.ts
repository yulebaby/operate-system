import { HttpService } from './../../../services/http.service';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AddressService } from '../../../services/selects/address.service';
import { CustomerSourceService } from '../../../services/selects/customer-source.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCustomerComponent implements OnInit {

  validateForm: FormGroup;

  public addressItems: object[];

  public sourceItems: object[];

  public stopItems: object[] = [{id: -1, shopName: '请选择省市区'}];

  public submitLoading: boolean = false;

  submitForm = ($event, value) => {
    if(this.submitLoading) return;
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    this.submitLoading = true;

    this.http.post(`${environment.domain}/customerDetail/insert`, this.validateForm.value).then(res => {
      this.submitLoading = false;
      if (res.code == 1000) {
        this.subject.next('1');
      }else if(res.code == 1003){
        this.message.create('error', res.info);
      }
    }).catch( err => {
      this.submitLoading = false;
    })
  };

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }


  constructor(
    private fb: FormBuilder,
    private address: AddressService,
    private subject: NzModalSubject,
    private http: HttpService,
    private source: CustomerSourceService,
    private message: NzMessageService
  ) {
    this.validateForm = fb.group({
      secondName: ['', [Validators.required]],
      parentPhone: ['', [Validators.required, Validators.pattern(/^1[3|5|7|8][0-9]\d{8}$/)], [this.parentPhoneAsyncValidator]],
      address: [''],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      area: ['', [Validators.required]],
      shopId: ['', [Validators.required]],
      customerSpreadRelationId: ['', [Validators.required]],
      activityPrice: ['', [Validators.required, Validators.pattern(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)]]
    });

    if (!address.addressItems.length){
      this.http.get(`${environment.domain}/common/getAllProvinceCityArea`).then(res => {
        address.addressItems = res || [];
        this.addressItems = res || [];
      })
    }else{
      this.addressItems = address.addressItems;
    }

    if (!source.sourceItems.length) {
      this.http.post(`${environment.domain}/common/selectSpreadRelations`).then(res => {
        source.sourceItems = res.result || [];
        this.sourceItems = res.result || [];
      })
    } else {
      this.sourceItems = source.sourceItems
    }
  };
  
  ngOnInit() {
 
  }

  /* -------------------------- 省市区联动改变事件 ------------------------- */
  _addressChange(value) {
    if (value[0]) {
      this.validateForm.patchValue({
        province: value[0] || '',
        city: value[1] || '',
        area: value[2] || ''
      });
      this.http.post(`${environment.domain}/common/findByShopObj`, {
        provinceCode: value[0] || '',
        cityCode: value[1] || '',
        areaCode: value[2] || ''
      }).then( res => {
        if (res.code == 1000 && res.result.length) {
          this.stopItems = res.result;
        } else {
          this.stopItems = [{ id: null, shopName: '该城市下暂无门店' }]
        }
      })
    }
  }

  /* -------------------------- 手机号是否重复验证 ------------------------- */
  parentPhoneAsyncValidator = (control: FormControl): any => {
    return Observable.create( (observer) => {
      this.http.post(`${environment.domain}/customerDetail/selectParentPhone`, {
        parentPhone: control.value
      }).then( res => {
        if(res.code == 1000){
          observer.next(null)
        }else{
          observer.next({error: true, duplicated: true});
        }
        observer.complete();
      })
    })
  };
}
