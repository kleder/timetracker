import { Injectable } from '@angular/core';
import { UrlParserService } from '../url-parser.service';
import { Account } from '../../models/Account';
import { ApiService } from './api.service';
import { WorkItem } from '../../models/WorkItem';
import { Agile } from '../../models/Agile';
import { Issue } from '../../models/Issue';
import { Board } from '../../models/Board';
import { Priority } from '../../models/Priority';

var JiraApi = require('jira-client');

export class JiraApiService implements ApiService {
    
  private jiraApi;

  constructor(private urlParserService: UrlParserService) {
        
  }
  private GetConsumereKey(key: string){
      return '-----BEGIN RSA PRIVATE KEY-----\n' + key + '\n-----END RSA PRIVATE KEY-----'; 
    }

  useAccount(remoteAccount?: Account): void {
      this.urlParserService.setUrl (remoteAccount.Jira.url);
   
      this.jiraApi = new JiraApi({
          host: this.urlParserService.getHostname(),
            protocol: this.urlParserService.getProtocol(),
            port: this.urlParserService.getPort(),
          oauth: {
            consumer_key: 'OauthKey',
            access_token: remoteAccount.Jira.accessToken,
            accesss_token_secret: remoteAccount.Jira.accessTokenSecret,
            consumer_secret: this.GetConsumereKey(remoteAccount.Jira.consumerSecret)
          }
        });
  }
  getAllProjects(): Promise<any> {
      throw new Error("Method not implemented.");
  }
  getCommandSuggestions(id: string, command: any): Promise<any> {
      throw new Error("Method not implemented.");
  }
  executeCommand(id: string, command: any): Promise<any> {
      throw new Error("Method not implemented.");
  }
  createIssueOnBoard(data: Issue, boardName: any): Promise<void> {
      throw new Error("Method not implemented.");
  }
  
  getAllBoards(): Promise<any> {
    return this.jiraApi.doRequest(this.jiraApi.makeRequestHeader(this.jiraApi.makeAgileUri({
      pathname: '/board',
      query: {
        startAt: 0,
        maxResults: 50,
      }
    }))).then(s =>  Promise.resolve(s.values.map(p => Board.createFromJira(p))));
  }   
  getIssuesByProject(id: any): Promise<any> {
      throw new Error("Method not implemented.");
  }
  getIssuesByAgile(board : Board): Promise<any> {
    return this.jiraApi.getIssuesForBoard(board.timeTrackerId).then(s => 

      Promise.resolve(s.issues.map(p => Issue.createFromJira(p)))
    );
  }
  getIssue(id: any): Promise<any> {
      throw new Error("Method not implemented.");
  }
  getSprintInfo(agile: any): Promise<any> {
      throw new Error("Method not implemented.");
  }
  createWorkItem(data: WorkItem) : Promise<string> {
      throw new Error("Method not implemented.");
  }
  getWorkItems(issueId: any): Promise<any> {
      throw new Error("Method not implemented.");
  }
  editWorkItem(workItem: WorkItem) {
      throw new Error("Method not implemented.");
  }
  deleteWorkItem(workItem: WorkItem) {
      throw new Error("Method not implemented.");
  }
  getTimeTrackingWorkTypes(projectId: any) {
      throw new Error("Method not implemented.");
  }
  async getCurrentUser(remoteAccount: Account) {
      this.useAccount(remoteAccount);
      return this.jiraApi.getCurrentUser();
  }

  getPriorities(projectId: any): Promise<Priority[]> {
    throw new Error("Method not implemented.");
    }

}
