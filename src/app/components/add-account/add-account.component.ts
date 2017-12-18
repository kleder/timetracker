import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public correctLoginData = true;
  public loader = false;
  public name = ""
  public youTrackUrl = "";
  public token = "";
  public notificationText: string

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService)
    {
    }

  async ngOnInit() {
    var current = await this.account.Current();
    if (current!= undefined){
      this.router.navigate(['/boards'], { queryParams: {isLogged: false, name: current.name} });
    }
    this.activatedRoute
    .queryParams
    .subscribe(async params => { })

  }

  public login = async () => {
    this.loader = true;
    var rAccount = new RemoteAccount;
    rAccount.name = this.name;
    rAccount.token = this.token;
    rAccount.url = this.youTrackUrl;
    console.log('rAccount',rAccount)
    this.apiService.getCurrentUser(rAccount).then(
      (data) => {
        console.log("data", data)
        console.log('rAccount',rAccount)
        this.account.add(rAccount.name, rAccount.url, rAccount.token);
        this.loader = false;
        this.goToBoard()
      }, (error) => {
        this.errorHtml()
        this.errorNotification()
        this.loader = false;
        this.correctLoginData = false;
        }
    )   
  }

  public errorHtml() {
    let url = document.getElementById('add-account__url')
    let token = document.getElementById('add-account__token')
    url.className += " add-account__url--error"
    token.className += " add-account__token--error"
  }

  public errorNotification() {
    let that = this
    setTimeout(function() { 
      that.notificationText = "Error eccoured! Incorrect URL or token"
      let element = document.getElementById("default-notification")
      element.className = "show";
      setTimeout(function() { 
        element.className = element.className.replace("show", "")
      }, 2500);
    }, 300)
  }

  public closeNotification() {
    let element = document.getElementById("default-notification")
    element.className = element.className.replace("show", "")    
  }

  goToBoard() {
    this.router.navigate(['/boards'], { queryParams: {isLogged: true, name: this.name} });
  }

}
