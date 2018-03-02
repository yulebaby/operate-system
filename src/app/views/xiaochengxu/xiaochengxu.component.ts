import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xiaochengxu',
  templateUrl: './xiaochengxu.component.html',
  styleUrls: ['./xiaochengxu.component.scss']
})
export class XiaochengxuComponent implements OnInit {

  public queryForm: FormGroup

  constructor(
    private fb: FormBuilder = new FormBuilder()
  ) { 
    this.queryForm = fb.group({
      parentPhone: [''],
      secondName: [''],
      stage: ['']
    })
  }

  ngOnInit() {
  }

  resetForm(): void {
    this.queryForm.reset();
  }

}
