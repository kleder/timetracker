import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'

import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service'
import { HttpService } from '../../services/http.service'
import { AccountService } from '../../services/account.service'
import { remote } from 'electron'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public accounts: any
  constructor(
    public databaseService: DatabaseService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private accountService: AccountService,
    private http: HttpService
  ) { }

  ngOnInit() {
    this.getAccounts()
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      let url = params['returnUrl']
      if (url) {
        this.dataService.routeBeforeMenu = url.split("?")[0]        
      }
    });
  }

  public async getAccounts(): Promise<any> {
    this.accounts = await this.databaseService.getAccounts();
    console.log("this.accounts", this.accounts)
    if (this.accounts.length == 0) {
      this.dataService.routeBeforeMenu = ''
      this.http.UseAccount(this.accountService.clearCurrent())
    }
  }

  public editAccount(account) {
    console.log("account in editAccount", account)
    this.router.navigate(['edit-account'], { queryParams: {accountId: account.id, accountName: account.name, accountUrl: account.url} });
  }

  hideMenu() {
    this.router.navigate([this.dataService.routeBeforeMenu])
  }
  
  quit() {
    var win = remote.getCurrentWindow();
    win.close();
  }
}
