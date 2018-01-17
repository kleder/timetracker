import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service'
import { DatabaseService } from '../../services/database.service'
import { HttpService } from '../../services/http.service'
import { AccountService } from '../../services/account.service'
import { MenuService } from '../../services/menu.service'

@Component({
  selector: 'app-switch-account',
  templateUrl: './switch-account.component.html',
  styleUrls: ['./switch-account.component.scss']
})
export class SwitchAccountComponent implements OnInit {
  public accounts: any  
  public isCurrentAccountExists: boolean
  constructor(
    public databaseService: DatabaseService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private accountService: AccountService,
    private http: HttpService,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.getAccounts().then(() => {
      console.log("his.isCurrentAccountExists)", this.isCurrentAccountExists)
      if (!this.isCurrentAccountExists) {
        this.menuService.enabledWorkspace(false)
      }
    })
  }

  public async getAccounts(): Promise<any> {
    this.accounts = await this.databaseService.getAccounts();
    console.log("this.accounts", this.accounts)
    if (this.accounts.length == 0) {
      this.goToAddAccount(true)
    }
    this.accounts.forEach(account => {
      account.current? this.isCurrentAccountExists = true : ''
    })    
  }
  
  public setAsCurrent(clickedAccount) {
    console.log("clickedAccount.current", clickedAccount.current)
    this.accounts.forEach(account => {
      account['current'] = 0
      if (account['id'] == clickedAccount.id) {
        account['current'] = true
      }
    })
    this.menuService.enabledWorkspace(false)
    this.databaseService.destroyCurrentAccount()
    this.databaseService.setCurrentAccount(clickedAccount.id)
    this.goBack()
  }

  goToAddAccount(arg) {
    this.router.navigate(['add-account'], { queryParams: {firstAccount: arg} })    
  }

  goBack() {
    this.router.navigate(['/'])
  }

}
