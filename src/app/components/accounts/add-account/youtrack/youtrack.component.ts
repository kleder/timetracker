import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgStyle } from '@angular/common';
import 'rxjs/add/operator/map';

import { AccountService } from '../../../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { Account} from 'app/models/Account';
import { ToasterService } from '../../../../services/toaster.service';
import { shell } from 'electron';

import { DataService } from '../../../../services/data.service';
import { MenuService } from '../../../../services/menu.service'
import { DatabaseService } from '../../../../services/database.service'
import { NumberValueAccessor } from '@angular/forms/src/directives/number_value_accessor';
import { SpinnerService } from '../../../../services/spinner.service';

import { AccountType } from '../../../../models/AccountType';
import { filter } from 'rxjs/operator/filter';
import { ApiProviderService } from '../../../../services/api/api-provider.service';
import { UrlParserService } from '../../../../services/url-parser.service';
import { ApiService } from '../../../../services/api/api.service';
import { YouTrackAccount } from '../../../../models/YouTrackAccount';
import { AddAccountBase } from '../add-account-base';

const ENTER_KEYCODE = 1

@Component({
  selector: 'app-youtrack',
  templateUrl: './youtrack.component.html',
  styleUrls: ['./youtrack.component.scss'],

})
export class YoutrackComponent extends AddAccountBase implements OnInit {
  public name = ""
  public youTrackUrl = "";
  public token = "";
  public firstAccount: boolean;
  public accounts;

  private api: ApiService;


  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public toasterService: ToasterService,
    public dataService: DataService,
    private menuService: MenuService,
    private databaseService: DatabaseService,
    protected spinnerService: SpinnerService,
    private urlParserService: UrlParserService,
    private apiServiceProvider: ApiProviderService,
  )
  {
    super(spinnerService, toasterService, router, account);
    this.apiServiceProvider.init(AccountType.YouTrack)
    let that = this;
   this.api = this.apiServiceProvider.getInstance();
  }

  async ngOnInit() {
    this.name = "aaaaa";
    this.youTrackUrl = "https://trecapp.myjetbrains.com/youtrack";
    this.token = "perm:cm9vdA==.YXNkc2E=.Cj2jFrdu0AM7CcET0xbHO8q0z4OOb6"
    this.activatedRoute.queryParams.subscribe(async (params) => {
        this.changeAccountSettings = params["changeAccountSettings"] !== undefined;
        this.accountId = params["accountId"];
        
    });

  }

  public login = async () => {
    this.spinnerService.visible = true;
    let that = this;
    var rAccount = new Account;
    rAccount.type = AccountType.YouTrack;
    rAccount.Youtrack = new YouTrackAccount(this.name, this.youTrackUrl, this.token);
    
    super.loginToAccount(rAccount,  this.api, window);
  }

  public onEnterKey(e) {
    if (e.keyCode === ENTER_KEYCODE) {
      this.login()
    }
  }

  

  openInBrowser() {
    shell.openExternal('https://www.jetbrains.com/help/youtrack/standalone/Manage-Permanent-Token.html');
  }

  
}
