import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddCustomerComponent implements OnInit {
  validateForm: FormGroup;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
    }
    console.log(value);
  };

  resetForm($event: MouseEvent) {
    $event.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
    }
  }

  validateConfirmPassword() {
    setTimeout(_ => {
      this.validateForm.controls['passwordConfirmation'].updateValueAndValidity();
    })
  }

  getFormControl(name) {
    return this.validateForm.controls[name];
  }


  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^1[3|5|7|8][0-9]\d{8}$/)]]
    });
  };
  
  ngOnInit() {

  }
}
