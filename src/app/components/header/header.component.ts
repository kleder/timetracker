import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    
  ) {
    console.log(process.env)
   }

  ngOnInit() {    
  }

}
