import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddressService } from '../../../services/selects/address.service';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpCustomerComponent implements OnInit {

  public queryForm: FormGroup;

  /* --------------------- 省市区集合 ---------------------- */
  public addressItems: any[] = null;

  /* -------------------- 所属门店集合 --------------------- */
  public storeItems: any[] = [{ value: 'jack', label: 'Jack' }, { value: 'lucy', label: 'Lucy' }, { value: 'disabled', label: 'Disabled', disabled: true }];

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private address: AddressService
  ) { 
    this.queryForm = fb.group({
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
    this.addressItems = address.addressItems;
  }

  ngOnInit() {
  }


  /* --------------------------- 根据筛选条件查询/重置 --------------------------- */
  query(): void {
    console.log(this.queryForm.value);
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
  }

}
 