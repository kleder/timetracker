import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';
import { ToasterService } from '../../services/toaster.service';
import { shell } from 'electron';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public loader = false;
  public name = ""
  public youTrackUrl = "";
  public token = "";

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService,
    public toasterService: ToasterService
  )
    {
    }

  async ngOnInit() {
    var current = await this.account.Current();
    if (current!= undefined){
      this.router.navigate(['/boards'], { queryParams: {justLoggedIn: false, name: current.name, url: current.url} });
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
        this.toasterService.showToaster("Error eccoured! Incorrect URL or token", 'error')        
        this.loader = false;
        }
    )   
  }

  public errorHtml() {
    let url = document.getElementById('add-account__url')
    let token = document.getElementById('add-account__token')
    url.className += " add-account__url--error"
    token.className += " add-account__token--error"
  }

  openInBrowser() {
    shell.openExternal('https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html');
  }

  goToBoard() {
    this.router.navigate(['/boards'], { queryParams: {justLoggedIn: true, name: this.name} });
  }

}
