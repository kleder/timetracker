import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { DatabaseService } from './database.service'
import 'rxjs/add/operator/map';
import { from } from 'rxjs/observable/from';
import { RemoteAccount, UserData } from 'app/models/RemoteAccount';
import { access } from 'original-fs';
import { ApiService } from 'app/services/api.service';

@Injectable()
export class AccountService {

  private currentAccount: RemoteAccount;

  constructor(
    private databaseService: DatabaseService
  ) { }

  public add(name: string, url: string, token: string): RemoteAccount {
    var account = new RemoteAccount();
    account.name = name;
    account.url = url;
    account.token = token;
    this.databaseService.addAccount(account);
    this.currentAccount = account;
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
          console.log('current', account)
          currentAccount = account
        }
      })
    }
    console.log("currentAccount", currentAccount)
    return new Promise<RemoteAccount>((resolve) => { resolve(currentAccount) });
  }

  public async destroyCurrent(): Promise<RemoteAccount> {
    var currentAccount: RemoteAccount = {name: '', url: '', token: ''}
    return new Promise<RemoteAccount>((resolve) => { resolve(currentAccount) });
  }
}
