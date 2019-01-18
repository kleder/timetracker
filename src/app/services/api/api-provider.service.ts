import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UrlParserService } from '../url-parser.service';
import { HttpService } from '../http.service';
import { AccountService } from '../account.service';
import { AccountType } from '../../models/AccountType';
import { JiraApiService } from './jira-api.service';
import { YoutrackApiService } from './youtrack-api.service';
import { DateService } from '../date.service';
import { DatabaseService } from '../database.service';

@Injectable()
export class ApiProviderService {

  private instance: ApiService;

  constructor(private urlParserService: UrlParserService, private httpService: HttpService, 
    private accountService: AccountService, private dateService:DateService, private databaseService: DatabaseService) { }

  public init(type: AccountType){
    if(type == AccountType.Jira){
      this.instance = new JiraApiService(this.urlParserService);
    } else if(type == AccountType.YouTrack){
        this.instance = new YoutrackApiService(this.httpService, this.accountService, this.dateService, this.databaseService);
    }
  }

  public  getInstance() : ApiService { 

    if(this.instance === undefined) {
      // await this.accountService.tryLogin();
      
       this.init(this.accountService.accountType);
    }

    return this.instance;
  }


public getInstance2() { 

    return this.instance; 
  
  }

}
