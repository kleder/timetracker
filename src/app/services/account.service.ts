import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service'
import 'rxjs/add/operator/map';
import { RemoteAccount } from '../models/RemoteAccount';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AccountService {
  private currentAccountObs = new BehaviorSubject<RemoteAccount>(new RemoteAccount())
  CurrentAccount = this.currentAccountObs.asObservable()

  constructor(
    private databaseService: DatabaseService
  ) { }

  public add(name: string, url: string, token: string): RemoteAccount {
    var account = new RemoteAccount();
    account.name = name;
    account.url = url;
    account.token = token;
    this.databaseService.addAccount(account);
    return account;
  }

  public async get(youtrack: string): Promise<RemoteAccount> {
    return await this.databaseService.getAccount(youtrack);
  }

  public async Current(): Promise<RemoteAccount> {
    var currentAccount: RemoteAccount;
    var accounts = await this.databaseService.getAccounts();
    if (accounts != undefined && accounts.length > 0) {
      accounts.filter(account => {
        if (account['current'] == 1) {
          currentAccount = account
          this.currentAccountObs.next(account);
        }
      })
    } else {
      this.currentAccountObs.next(new RemoteAccount());
    }
    return new Promise<RemoteAccount>((resolve) => { resolve(currentAccount) });
  }

  public async destroyCurrent(): Promise<RemoteAccount> {
    var currentAccount: RemoteAccount = {name: '', url: '', token: ''}
    this.currentAccountObs.next(currentAccount);
    return new Promise<RemoteAccount>((resolve) => { resolve(currentAccount) });
  }
}
