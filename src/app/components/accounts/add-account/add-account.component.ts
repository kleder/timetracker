import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ApiService } from '../../../services/api.service';
import { AccountService } from '../../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { RemoteAccount } from 'app/models/RemoteAccount';
import { ToasterService } from '../../../services/toaster.service';
import { shell } from 'electron';

import { DataService } from '../../../services/data.service';
import { MenuService } from '../../../services/menu.service'
import { DatabaseService } from '../../../services/database.service'
import { NumberValueAccessor } from '@angular/forms/src/directives/number_value_accessor';
import { SpinnerService } from '../../../services/spinner.service';

const ENTER_KEYCODE = 13

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public name = ""
  public youTrackUrl = "";
  public token = "";
  public firstAccount: boolean;
  public accounts;
  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public apiService: ApiService,
    public toasterService: ToasterService,
    public dataService: DataService,
    private menuService: MenuService,
    private databaseService: DatabaseService,
    private spinnerService: SpinnerService
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
    } else if (current == undefined) {
      this.menuService.enabledWorkspace(false)
      this.getAccounts().then(() => {
        if (this.accounts.length == 0) {
          this.accounts = false
          this.menuService.enabledWorkspaceAndSwitchAccount(false)        
        }
      })
    }
  }

  public login = async () => {
    this.spinnerService.visible = true;
    var rAccount = new RemoteAccount;
    rAccount.name = this.name;
    rAccount.token = this.token;
    rAccount.url = this.youTrackUrl;
    if (!window.navigator.onLine) {
      this.toasterService.error("No internet connection")
    } else {
      this.apiService.getCurrentUser(rAccount).then(
        (data) => {
          if (rAccount.name.length < 3) {
            this.clearErrorUrlOrToken()
            this.errorName()
          } else {
            this.account.add(rAccount.name, rAccount.url, rAccount.token);
            this.goToBoard()
          }
          this.spinnerService.visible = false;
        }, (error) => {
          this.errorUrlOrToken()
          this.toasterService.error("Error occoured! Incorrect URL or token")    
          this.spinnerService.visible = false;    
        }
      )   
    }
  }

  public onEnterKey(e) {
    if (e.keyCode === ENTER_KEYCODE) {
      this.login()
    }
    
  }

  public async getAccounts(): Promise<any> {
    this.accounts = await this.databaseService.getAccounts();
  }

  public errorName() {
    let url = document.getElementById('add-account__name')
    url.className += " add-account__name--error"
    this.toasterService.error("Error occoured! The name must be longer than 3 characters.")   
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
