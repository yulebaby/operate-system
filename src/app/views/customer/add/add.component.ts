import { HttpService } from './../../../services/http.service';
import { NzModalSubject } from 'ng-zorro-antd';
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

  public stopItems: object[];

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    this.http.post(`${environment.domain}/customerDetail/insert`, this.validateForm.value).then(res => {
      this.subject.next(true);
    })
  };

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
    }
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }


  constructor(
    private fb: FormBuilder,
    private address: AddressService,
    private subject: NzModalSubject,
    private http: HttpService,
    private source: CustomerSourceService
  ) {
    this.validateForm = fb.group({
      secondName: ['', [Validators.required]],
      parentPhone: ['', [Validators.required, Validators.pattern(/^1[3|5|7|8][0-9]\d{8}$/)]],
      address: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      area: ['', [Validators.required]],
      shopId: ['', [Validators.required]],
      customerSpreadRelationId: ['', [Validators.required]],
      activityPrice: ['', [Validators.required, Validators.pattern(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)]]
    });
    this.sourceItems = source.sourceItems;
    this.addressItems = address.addressItems;
  };
  
  ngOnInit() {
    
  }

  /* ---------------------------- 保存用户信息 ---------------------------- */
  saveUserInfo (): void {
    this.http.post(`${environment.domain}/customerDetail/insert`, this.validateForm.value).then( res => {
      console.log(res)
    })
  }


  /* -------------------------- 省市区联动改变事件 ------------------------- */
  _addressChange(value) {
    this.validateForm.patchValue({
      province: value[0] || '',
      city: value[1] || '',
      area: value[2] || ''
    });
    this.http.post(`${environment.domain}/common/findByShopObj`, {
      province: value[0] || '',
      city: value[1] || '',
      area: value[2] || ''
    }).then( res => {
      this.stopItems = res.result;
    })
  }
}
