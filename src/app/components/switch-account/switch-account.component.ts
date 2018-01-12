import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service'
import { DatabaseService } from '../../services/database.service'
import { HttpService } from '../../services/http.service'
import { AccountService } from '../../services/account.service'

@Component({
  selector: 'app-switch-account',
  templateUrl: './switch-account.component.html',
  styleUrls: ['./switch-account.component.scss']
})
export class SwitchAccountComponent implements OnInit {
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
  }

  public async getAccounts(): Promise<any> {
    this.accounts = await this.databaseService.getAccounts();
    console.log("this.accounts", this.accounts)
    if (this.accounts.length == 0) {
      this.dataService.routeBeforeMenu = ''
    }
  }

  public editAccount(account) {
    console.log("account in editAccount", account)
    this.router.navigate(['edit-account'], { queryParams: {accountId: account.id, accountName: account.name, accountUrl: account.url} });
  }
  
  public setAsCurrent(clickedAccount) {
    console.log("clickedAccount.current", clickedAccount.current)
    this.accounts.forEach(account => {
      account['current'] = 0
      if (account['id'] == clickedAccount.id) {
        account['current'] = true
      }
    })
    this.databaseService.destroyCurrentAccount()
    this.databaseService.setCurrentAccount(clickedAccount.id)
  }

}
