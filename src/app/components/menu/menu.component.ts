import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service'

import { Router } from '@angular/router';
import { Location } from '@angular/common';

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
    private location: Location
  ) { }

  ngOnInit() {
    this.getAccounts()
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
    
  }
}
