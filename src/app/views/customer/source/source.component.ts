import { Component, OnInit } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  public validateForm: FormGroup;

  constructor(
    private fb: FormBuilder = new FormBuilder(),
    private subject: NzModalSubject
  ) { 
    this.validateForm = fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/)]]
    })
  }


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

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    this.subject.next('1');
  };

  ngOnInit() {
  }

}
