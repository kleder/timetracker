import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'

import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../../services/data.service'

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
    private dataService: DataService
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
  }

  public editAccount(account) {
    console.log("account in editAccount", account)
    this.router.navigate(['edit-account'], { queryParams: {accountName: account.name, accountUrl: account.url, accountToken: account.token} });
  }

  hideMenu() {
    this.router.navigate([this.dataService.routeBeforeMenu])
  }
}
