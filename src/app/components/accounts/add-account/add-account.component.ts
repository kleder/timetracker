import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Account } from 'app/models/Account';
import { ToasterService } from '../../../services/toaster.service';
import { shell } from 'electron';
import { DataService } from '../../../services/data.service';
import { MenuService } from '../../../services/menu.service'
import { DatabaseService } from '../../../services/database.service'
import { NumberValueAccessor } from '@angular/forms/src/directives/number_value_accessor';
import { SpinnerService } from '../../../services/spinner.service';
import { AccountType } from '../../../models/AccountType';
import { filter } from 'rxjs/operator/filter';
import { ApiProviderService } from '../../../services/api/api-provider.service';
import { ApiInitService } from '../../../services/api/api-init.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {
  public issueTrackerType = AccountType;

  constructor(
    public account: AccountService,
    public router: Router, 
    public activatedRoute: ActivatedRoute,
    public toasterService: ToasterService,
    public dataService: DataService,
    public route:ActivatedRoute,
    private menuService: MenuService,
    private databaseService: DatabaseService,
    private spinnerService: SpinnerService,
    private apiInitService: ApiInitService,
  )
  {
    
  }

  async ngOnInit() { 
    var loginSuccessfuly = await this.account.tryLogin();
    this.activatedRoute.queryParams.subscribe(async (params) => {
      if(loginSuccessfuly === true && params["createAccount"] !== "true") {
        let current = this.account.Current();
        this.apiInitService.init();
        this.router.navigate(['/workspace'], { queryParams: { name: this.getName(current), accountId :current.id} });
      }
    });
  }

  onClick(type: AccountType){
    if(type == AccountType.Jira){
      this.router.navigate(['../add-jira'], { relativeTo: this.route} );
    } else {
      this.router.navigate(['../add-youtrack'], { relativeTo: this.route} );
    }
  }

  private getName(account: Account) {
    return account.type == AccountType.Jira ? account.Jira.name : account.Youtrack.name;
  }
}
