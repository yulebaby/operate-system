import { HttpService } from './../../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpService
  ) { }

  data: any = {};

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( (res: any) => {
      this.http.post('/wxCustomerInformation/findWxCustomerDetailInfo', { wxCustomerId: res.params.id}).then( res => {
        this.data = res.code == 1000 ? res.result : {};
      })
    })
  }

}
