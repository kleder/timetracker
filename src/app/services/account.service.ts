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
    if (this.currentAccount != undefined) {
      currentAccount = this.currentAccount;
    } else {
      var accounts = await this.databaseService.getAccounts();
      if (accounts != undefined && accounts.length > 0) {
        currentAccount = accounts[0];
      }
    }
    return new Promise<RemoteAccount>((resolve) => { resolve(currentAccount) });
  }
}
