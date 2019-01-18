import { Component, OnInit } from '@angular/core';

import { Http, Headers } from '@angular/http';
import { NgStyle } from '@angular/common';
import 'rxjs/add/operator/map';

import { ApiService } from '../../../../services/api/api.service';
import { AccountService } from '../../../../services/account.service';

import { Router, ActivatedRoute } from '@angular/router';
import { Account } from 'app/models/Account';
import { ToasterService } from '../../../../services/toaster.service';
import { shell } from 'electron';

import { DataService } from '../../../../services/data.service';
import { MenuService } from '../../../../services/menu.service'
import { DatabaseService } from '../../../../services/database.service'
import { NumberValueAccessor } from '@angular/forms/src/directives/number_value_accessor';
import { SpinnerService } from '../../../../services/spinner.service';

import { AccountType } from '../../../../models/AccountType';
import { filter } from 'rxjs/operator/filter';


import { UrlParserService } from '../../../../services/url-parser.service'
import { JiraApiService } from '../../../../services/Api/jira-api.service';
import { ApiProviderService } from '../../../../services/api/api-provider.service';
import { JiraAccount } from '../../../../models/JiraAccount';
import { AddAccountBase } from '../add-account-base';
import { raceStatic } from 'rxjs/operator/race';


var JiraApi = require('jira-client');

const ENTER_KEYCODE = 1

@Component({
  selector: 'app-jira',
  templateUrl: './jira.component.html',
  styleUrls: ['./jira.component.scss'],

})
export class JiraComponent extends AddAccountBase  {
  public name = ""
  public jiraUrl = "";
  public accessToken = "";
  public accessTokenSecret = "";
  public firstAccount: boolean;
  public accounts;
  public consumerSecret;
  protected apiService: ApiService;


  constructor(
    public http: Http,
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    protected toasterService: ToasterService,
    public dataService: DataService,
    private menuService: MenuService,
    private databaseService: DatabaseService,
    protected spinnerService: SpinnerService,
    private urlParserService: UrlParserService,
    private apiServiceProvider: ApiProviderService
  )
  {
    super(spinnerService, toasterService, router, account);
    this.apiServiceProvider.init(AccountType.Jira)
    this.apiService = this.apiServiceProvider.getInstance();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.changeAccountSettings =  params["changeAccountSettings"] !== undefined;
      this.accountId = params["accountId"];
  });

    this.name = "aaaaa";
    this.jiraUrl = "http://18.217.239.147:8080";
    this.accessTokenSecret = 'RcMf0W';
    this.accessToken = 'oaxVauJyz3P6lkwlHE0wqYlOk6mPxc9x';
    this.consumerSecret =  'MIICXAIBAAKBgQCwpAdohK5rYEONuEu7nEMbMgmfYdpbho+re38gECdTwFUnieEk' +
        'OPDknHZhna7HWg9e2gLhxZUcX5wOwt7fwbtNEgEDuxbLidn4OPJZ8VWSLj78sdXQ' +
        'fhWLA83FzzqX23Byiy5wblnF/Lg0HG5dCnkFmjF2Bw74mH23Il8unncHWwIDAQAB' +
        'AoGALF320mTJHoU+UoFg3E2ieVk3G4ZLf0OsIGlTg+0qw5mCifzSxPNcZj96aIhf' +
        'lwji5XMi2Cx1iHvnSbnemxsg/Q6LgExnEb2433/ifYpbOo0pv0jth2pqM1tPzc6S' +
        'gL6S7P18kmATuvUDK78clXmULpgI/qV2ldWRDzCpdJgCqLkCQQDl39KCVmn9uJZk' +
        '3mCdCD+DQ0xiZz3zQxL5RAI5OwTeaXYBUl2hOgk1tsPU/2sJ+1ZBjnF41DODbrLf' +
        'gnSBZIyvAkEAxLdhJ3e0aUTeP1ryPXG/NtJAX2gY9VPdRrDANI+Qe7vcqo58sx6a' +
        'Ad4bwACQdTKk8Eo0rn8Fxp3RbSNINEGTFQJBAM5Xl1K/1uyVYQqyQu8ylDBznIFI' +
        'Q2e1cbamwYg13iz3ZaHSGZG70sCQikEL9T1EiyzVfC4F7SexmobfR01OwKkCQALZ' +
        '/aiKzayw+N/GO7i0S2dKCPDZG3OC8bQyn7ajVh7VDE/UnO4jxWu9gn14BKAOSeHJ' +
        '0ZWt9bF5XC3O0x8ezDkCQC8sI5XyByNhAyN4C4LGVqDQU5UtvLqQUsJ71SrUfvgs' +
        'wqMueUiYymi49KNz/YutGf/MPdyaNLxsgLz+sXJnRTE=';
  }
  
  public login = async () => {
    var rAccount = new Account;
    rAccount.Jira = new JiraAccount(this.name, this.jiraUrl, 'OauthKey', 
    this.accessToken, this.accessTokenSecret, this.consumerSecret)
    rAccount.type = AccountType.Jira;
    super.loginToAccount(rAccount, this.apiService, window);
  }

  public onEnterKey(e) {
    if (e.keyCode === ENTER_KEYCODE) {
      this.login()
    }
  }
}
