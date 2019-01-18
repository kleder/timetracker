import { OnInit } from "@angular/core";
import { SpinnerService } from "../../../services/spinner.service";
import { ToasterService } from "../../../services/toaster.service";
import { Router } from "@angular/router";
import { Account } from "../../../models/Account";
import { ApiService } from "../../../services/api/api.service";
import { AccountService } from "../../../services/account.service";
import { AccountType } from "../../../models/AccountType";

export class AddAccountBase {
    
   
    protected toasterService: ToasterService;
    protected spinnerService: SpinnerService;
    protected router: Router;
    protected accountService: AccountService;
    protected apiService: ApiService;
    public changeAccountSettings: boolean;
    protected accountId: string;
    
    constructor(
         spinnerService: SpinnerService, 
         toasterService: ToasterService,
         router: Router,
         accountService: AccountService
        ) {

        this.toasterService = toasterService;
        this.toasterService = toasterService;
        this.router = router;
        this.accountService = accountService;
    }

    public async loginToAccount(account: Account, apiService: ApiService, window: Window) {
        this.apiService = apiService;
        if(!window.navigator.onLine){
            this.toasterService.error("No internet connection")
        } else {
            this.internalLoginToAccount(account);
        }
    }

    private async internalLoginToAccount(account: Account){
        let that = this;
        this.showNameError(account);
        this.spinnerService.visible = true;
        this.apiService.getCurrentUser(account)
            .then(
                (data) => {
                    this.loginClickButtonClicked(account, that);
                    
                    this.spinnerService.visible = false;
                }, (error) => {
                    this.toasterService.error("Error occoured! Incorrect URL or token" )
                    this.spinnerService.visible = false;
                }
            )
    }

    private goToBoard(name: string, accountId : string) : void {

        if(this.changeAccountSettings){
        } else{
            this.router.navigate(['/boards'], { queryParams: { name: name, accountId : accountId} });    
        }
    }

    private loginClickButtonClicked(account: Account, that){
        if(this.changeAccountSettings){
            this.editAccount(account, that);
        } else {
            this.createAccount(account, that);
        }
    }

    private editAccount(account: Account, that): any {
        this.accountService.update(account).then(() => {
            this.router.navigate(['accounts/edit-account'], { queryParams: {  accountId : this.accountId} });

        });
    }

    private createAccount(account: Account, that): any {
        this.accountService.add(account)
                    .then(p => {
                        that.goToBoard(that.getCurrentAccountName(account), p);
                    })
    }



    private getCurrentAccountName(account: Account) : string {
        return account.type == AccountType.Jira ? account.Jira.name : account.Youtrack.name;
    }


    private showNameError(account: Account) : void {
        if(this.getCurrentAccountName(account).length <= 3)
            this.toasterService.error("Error occoured! The name must be longer than 3 characters.");
    }
}