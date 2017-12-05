import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  public validateForm: FormGroup;

  _userInfo: object;

  @Input()
  set userInfo(value: object) {
    this._userInfo = value;
  }

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private subject: NzModalSubject
  ) { }

  ngOnInit() {
    console.log(this._userInfo);
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      reserveTime: [''],
      type: [0],
      desc: [''],
      remark: ['']
    })
  }


  getFormControl(name) {
    return this.validateForm.controls[name];
  }

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

  emitDataOutside() {
    this.subject.next('传出数据');
  }

}
