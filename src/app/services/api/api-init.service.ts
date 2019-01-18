import { Injectable } from '@angular/core';

import { AccountService } from '../account.service';
import { AccountType } from '../../models/AccountType';

import { ApiProviderService } from './api-provider.service';

@Injectable()
export class ApiInitService {


  constructor(private apiServiceProvider: ApiProviderService, private accountService: AccountService,
    
  ) { 

  }

  public async init(){
      let account =  this.accountService.Current();
      
        if(account === undefined){
          await this.accountService.tryLogin();
          account = this.accountService.Current();
        }
        this.apiServiceProvider.init(account.type);
      //this.apiServiceProvider.getInstance().then(p => p.useAccount(account)); 
  }
}
