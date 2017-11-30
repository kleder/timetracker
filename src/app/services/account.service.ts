import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {DatabaseService } from './database.service'
import 'rxjs/add/operator/map';
import { from } from 'rxjs/observable/from';
import { RemoteAccount, UserData } from 'app/models/RemoteAccount';
import { access } from 'original-fs';

@Injectable()
export class AccountService {
  title = `Kleder Track App`;
  

  constructor(
    public http: Http,
    private databaseService: DatabaseService
  ) { }

  public add(url: string, token: string) : RemoteAccount {
    var account = new RemoteAccount();
    account.url = url;
    account.token =  token;
    this.databaseService.addAccount(account);
    return account;
  }

  public get(youtrack: string) : Promise<RemoteAccount> {
    return this.databaseService.getAccount(youtrack);
  }

  public user(remoteAccount: RemoteAccount) : Promise<UserData> {
    return new Promise<UserData>( (resolve) => {
      resolve(new UserData());
    });
  }
}
