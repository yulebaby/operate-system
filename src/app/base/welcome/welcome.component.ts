import { environment } from './../../../environments/environment';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewChecked {

  public itemTime: Date;

  public shopItems: object[] = [];

  constructor(
    private datePipe: DatePipe,
    private http: HttpService
  ) { 
    this.itemTime = new Date(datePipe.transform(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd'));
  }

  ngOnInit() {
    
  }

  /* ------------- 禁止选择今天以后的日期 ------------- */
  _disabledDate = current => {
    return current && current.getTime() > Date.now();
  };

  getData(): void {
    this.http.post(`${environment.domain}/precontractLog/findShopCounts`, {
      reserveStartDate: this.datePipe.transform(this.itemTime.getTime(), 'yyyy-MM-dd'),
      reserveEndDate: this.datePipe.transform(this.itemTime.getTime(), 'yyyy-MM-dd')
    }).then(res => {
      if (res.code == 1000) {
        this.shopItems = res.result;
      } else {
        this.shopItems = [];
      }
    })
  }

  private checkTime: Date;
  ngAfterViewChecked() {
    if (this.checkTime !== this.itemTime) {
      this.checkTime = this.itemTime;
      this.getData();
    }
  }

}
