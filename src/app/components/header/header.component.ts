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
    document.getElementById('menu').className = "show";
    setTimeout(() => {
      document.getElementById('backdrop').className = "show";      
    }, 400)
  }

  hideMenu() {
    document.getElementById('menu').className = document.getElementById('menu').className.replace("show", "hide")
    document.getElementById('backdrop').className = document.getElementById('backdrop').className.replace("show", "hide")      
  }

  showEditAccount() {
    document.getElementById('edit-account').className = "show";
  }

  hideEditAccount() {
    document.getElementById('edit-account').className = document.getElementById('edit-account').className.replace("show", "hide")
  }


}
