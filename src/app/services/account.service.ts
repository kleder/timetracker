import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { DatabaseService } from './database.service'
import 'rxjs/add/operator/map';
import { from } from 'rxjs/observable/from';
import { Account } from 'app/models/Account';
import { access } from 'original-fs';
import { BehaviorSubject } from 'rxjs';
import { AccountType } from '../models/AccountType';

@Injectable()
export class AccountService {
  private currentAccountObs = new BehaviorSubject<Account>(new Account())
  CurrentAccount = this.currentAccountObs.asObservable()
  private current: Account;
  public accountType: AccountType;

  constructor(
    private databaseService: DatabaseService
  ) { 
  }

  public async add(remoteAccount: Account): Promise <any>{ 
    this.current = remoteAccount;
    return this.databaseService.addAccount(remoteAccount);
  }

  // think about better name, this is not a login..
  public async tryLogin() : Promise<boolean> {
    let that = this;
    return this.databaseService.getCurrentAccount().then( account => {
        console.log("acc" + account)
        that.current = account;
        that.accountType = account.type;
        return Promise.resolve(account !== undefined)
    } )
  }

  public async update(remoteAccount: Account): Promise<any>{
    return this.databaseService.updateAccount(remoteAccount)
  }

  public Current(): Account {
    return this.current;
  }

  public async destroyCurrent(): Promise<Account> {
    var currentAccount: Account = new Account();

    this.currentAccountObs.next(currentAccount);
    return new Promise<Account>((resolve) => { resolve(currentAccount) });
  }
}
