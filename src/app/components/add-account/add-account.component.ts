import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../services/api.service';
import { AccountService } from '../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';
import { ToasterService } from '../../services/toaster.service';
import { shell } from 'electron';

import { DataService } from '../../services/data.service';
import { MenuService } from '../../services/menu.service'

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
  public firstAccount: boolean

  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService,
    public toasterService: ToasterService,
    public dataService: DataService,
    private menuService: MenuService
  )
    {
    }

  async ngOnInit() {
    this.activatedRoute
    .queryParams
    .subscribe(async params => { 
      this.firstAccount = params['firstAccount']
    })
    var current = await this.account.Current();
    if (current != undefined && !this.firstAccount){
      this.router.navigate(['/boards'], { queryParams: {justLoggedIn: false, name: current.name, url: current.url} });
    } else if (current == undefined)      {
      this.menuService.enabledWorkspace(false)
    }
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
        if (rAccount.name.length < 3) {
          this.clearErrorUrlOrToken()
          this.errorName()
          this.loader = false;
        } else {
          this.account.add(rAccount.name, rAccount.url, rAccount.token);
          this.loader = false;
          this.goToBoard()
        }
      }, (error) => {
        this.errorUrlOrToken()
        this.toasterService.showToaster("Error eccoured! Incorrect URL or token", 'error')        
        this.loader = false;
        }
    )   
  
  }

  public errorName() {
    let url = document.getElementById('add-account__name')
    url.className += " add-account__name--error"
    this.toasterService.showToaster("Error eccoured! The name must be longer than 3 characters.", 'error')   
  }

  public clearErrorUrlOrToken() {
    let url = document.getElementById('add-account__url')
    let token = document.getElementById('add-account__token')
    url.className = ""
    token.className = ""
  }

  public errorUrlOrToken() {
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

  goBack() {
    this.router.navigate([this.dataService.routeBeforeMenu], { queryParams: { returnUrl: this.router.url } })
  }

}
