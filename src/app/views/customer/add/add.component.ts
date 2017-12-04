import { NzModalSubject } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AddressService } from '../../../services/selects/address.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCustomerComponent implements OnInit {

  validateForm: FormGroup;

  public addressItems: any[] = null;

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    this.emitDataOutside();
    console.log(value);
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
    private Address: AddressService,
    private subject: NzModalSubject
  ) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^1[3|5|7|8][0-9]\d{8}$/)]],
      address: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      area: ['', [Validators.required]],
      store: ['', [Validators.required]],
      source: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  };
  
  ngOnInit() {
    this.addressItems = this.Address.addressItems;
  }

  emitDataOutside() {
    this.subject.next('传出数据');
  }


  /* ---------------------------- 省市区联动改变事件 ---------------------------- */
  _addressChange(value) {
    this.validateForm.patchValue({
      province: value[0] || '',
      city: value[1] || '',
      area: value[2] || ''
    });
  }
  storeItems = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'tom', label: 'Tom' }
  ];
  priceItems = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 }
  ]
  sourceItems = [
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'tom', label: 'Tom' }
  ];
}
