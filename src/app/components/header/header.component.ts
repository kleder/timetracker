import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public correctLoginData = true;
  public loader = false;
  public name = ""
  public youTrackUrl = "";
  public token = "";

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute   
  ) {
    console.log(process.env)
   }

  ngOnInit() { 
  }

  showMenu() {
    document.getElementById('menu').style.visibility = 'visible'
  }

  hideMenu() {
    document.getElementById('menu').style.visibility = 'hidden'
  }
}
