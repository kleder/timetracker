import { Injectable } from '@angular/core';
import { Account } from '../../models/Account';
import {Http, Headers, RequestOptions  } from '@angular/http';
import { HttpService } from '../http.service';
import { AccountService } from '../account.service';
import { ApiService } from './api.service';
import { WorkItem } from '../../models/WorkItem';
import { Agile } from '../../models/Agile';
import { Issue } from '../../models/Issue';
import { Board } from '../../models/Board';
import { DateService } from '../date.service';
import { Priority } from '../../models/Priority';
import { DatabaseService } from '../database.service';

type Callback = (model: any) => any;

@Injectable()
export class YoutrackApiService implements ApiService {

  
  
  constructor(
    public http: HttpService,
    public accounts: AccountService,
    private dateService: DateService,
    private databaseService: DatabaseService
  ) {
    this.useAccount();
  }


  public async createWorkItem(data: WorkItem) : Promise<string> {
      let newItem = {
          date: data.startDate.getTime(),
          duration: this.dateService.getDurationInMinutes(data.startDate, data.endDate),
          description: "Added by T-REC App"
        }

        let issue = (await this.databaseService.getTask(data.issueId)).timeTrackerId

        return this.post('/rest/issue/' + issue + '/timetracking/workitem', newItem, p => this.getWorkItemId(p))
    
        // return new Promise(resolve => {
        //   this.useAccount().then(() => {
        //     this.http.post('/rest/issue/' + data.timeTrackerIssueId + '/timetracking/workitem', newItem)
        //       .subscribe(data => {
        //         resolve(this.getWorkItemId(data));
        //       }, error => {
        //         resolve(error)
        //       })
        //   })
        // })
  }


  private post(url: string, data: any, creationCallback: Callback = undefined): Promise<any> {
    return new Promise(resolve => {
      this.http.post(url, data).
      subscribe(resp => {
        creationCallback === undefined ?  resolve(resp) : resolve(creationCallback(resp));
      }, error => {
        resolve(error);
      })
    })
  }



  
  getTimeTrackingWorkTypes(projectId: any) {
      throw new Error("Method not implemented.");
  }

  private getWorkItemId(data): string {
    var location = data.headers.get("location");
    return location.substring(location.lastIndexOf("/") + 1);
  }


  public useAccount(remoteAccount?: Account): void {
      if (remoteAccount == undefined) {
          var remoteAccount = this.accounts.Current();
        }
        if (remoteAccount != undefined) {
          this.http.UseAccount(remoteAccount);
        }
  }


  public getAllProjects() {
      // return new Promise(resolve => {
      //     this.useAccount().then(() => {
      //       this.http.get('/rest/admin/project')
      //         .map(res => res.json())
      //         .subscribe(data => {
      //           resolve(data);
      //         }, error => {
      //           resolve(error)
      //         });
      //     });
      //   });
      return new Promise(() => {})

  }
  public getVersionInfo(): Promise<any> {
      return new Promise((resolve, reject) => {
          this.http.getRawUrl("https://api.github.com/repos/kleder/timetracker/releases/latest")
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, err => reject(err))
        })
  }

  private encodeQueryData(data) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }

  public getCommandSuggestions(id: string, command: any): Promise<{}> {
      // return new Promise((resolve, reject) => {
      //     this.http.get('/rest/issue/' + id + '/execute/intellisense?'+this.encodeQueryData(command), undefined)
      //     .map(res => res.json())
      //     .subscribe(result => {
      //       resolve(result), error => { reject(error) }
      //     });
      //   });
      return new Promise(() => {})

  }
  public executeCommand(id: string, command: any): Promise<{}> {
      // return new Promise((resolve, reject) => {
      //     let options = new RequestOptions();
      //     options.headers = new Headers();
      //     options.headers.append('Content-Type', 'application/x-www-form-urlencoded')
      //     this.http.post('/rest/issue/' + id + '/execute/', this.encodeQueryData(command), options).subscribe(commandResult => {
      //       resolve(commandResult), error => { reject(error) }
      //     });
      //   });
      return new Promise(() => {})

  }
  public createIssueOnBoard(data: Issue, board: Board): Promise<void> {
      // let id = "";
      // return new Promise((resolve, reject) => {
      //   this.useAccount().then(() => {
      //     this.http.put('/rest/issue?' + this.encodeQueryData(Issue.createToYouTrack(data, board)), "")
      //       .subscribe(result => {
      //         let loc = result.headers.get('Location');
      //         id = loc.substr(loc.lastIndexOf('/') + 1);
      //         resolve(id);
      //       }, error => {
      //         reject(error)
      //       });
      //   })
      // }).then(() => { this.executeCommand(id, { 'command': 'Assignee me Board ' + board.name + ' Current sprint' }) })
      return new Promise(() => {})

  }
  public getAllBoards(){

    return this.get('/rest/admin/agile', p => Board.createFromYouTrack(p))

    
  }
  public getIssuesByProject(id: any){
    return new Promise(() => {})

      // return new Promise(resolve => {
      //     this.useAccount().then(() => {
      //       this.http.get('/rest/issue/byproject/' + id + '?filter=for%3A+me')
      //         .map(res => res.json())
      //         .subscribe(data => {
      //           resolve(data)
      //         })
      //     })
      //   })
  }
  public getIssuesByAgile(board: Board) : Promise<Issue[]>{
    return this.get('/rest/issue?filter=for:me+Board+' + board.name + ':+{Current+sprint}+%23Unresolved&max=100', 
    s => Issue.createFromYouTrack(s), p => p.issue);
    // return new Promise(() => {})
    //   // return new Promise(resolve => {
    //   //     this.useAccount().then(() => {
    //   //       this.http.get('/rest/issue?filter=for:me+Board+' + board.name + ':+{Current+sprint}+%23Unresolved&max=100')
    //   //         .map(res => res.json())
    //   //         .subscribe(data => {
    //   //           resolve(data.issue.map(s => Issue.createFromYouTrack(s)))
    //   //         })
    //   //     })
    //   //   })
  }
  public getIssue(issueId: any){
      // return new Promise<IssueDetails>(resolve => {
      //     this.useAccount().then(() => {
      //       this.http.get('/rest/issue/' + issueId + '?wikifyDescription=true')
      //         .map(res => res.json())
      //         .subscribe(data => {
      //           resolve(data)
      //         })
      //     })
      //   })

      return new Promise(() => {});
  }
  public getSprintInfo(agile: any){
      let query = agile.url.split("/youtrack")[1]
  // return new Promise(resolve => {
  //   this.useAccount().then(() => {
  //     this.http.get(query)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         resolve(data)
  //       })
  //   })
  // })

  return new Promise(() => {})

  }


  public getPriorities(projectId: any): Promise<Priority[]> {
    return this.get('/rest/admin/customfield/bundle/priorities', p => Priority.createFromYouTrack(p), x => x.value)
  }

  public getWorkItems(issueId: any){
      return this.get('/rest/issue/' + issueId + '/timetracking/workitem')
  }
  public async editWorkItem(workitem: WorkItem){

    let newItem = {
      date: workitem.startDate.getTime(),
      duration: workitem.duration * 60,
      description: workitem.comment
    } 

    let issue = (await this.databaseService.getTask(workitem.issueId)).timeTrackerId

    return this.put('/rest/issue/' + issue + '/timetracking/workitem/' + workitem.timeTrackerId, newItem);

  }



  public async deleteWorkItem(workItem: WorkItem) : Promise<any>{

      let issue = (await this.databaseService.getTask(workItem.issueId)).timeTrackerId

      return this.delete('/rest/issue/' + issue + '/timetracking/workitem/' + workItem.timeTrackerId)
  }
 
  public getCurrentUser(remoteAccount: Account) {
      this.useAccount(remoteAccount);
      return this.get('/rest/user/current');
  }

  private put(url: string, item: any) : Promise<any> {
    return new Promise(resolve => {
            this.http.put(url, item)
              .subscribe(data => {
                resolve(data)
              })
        }) 
  }

  private delete(url: string): Promise<any>{
   return new Promise(resolve => {
            this.http.delete(url)
              .subscribe(data => {
                resolve(data)
              })
          })
  }

  private get(url: string, creationCallback: Callback = undefined,  dataInResponse: Callback = undefined): Promise<any>{
    
    return new Promise((resolve, reject) => {
            this.http.get(url)
              .map(res => res.json())
              .subscribe(data => {
                resolve(this.resolveResponse(data, creationCallback, dataInResponse));
              }, error => {
                reject(error)
              }
            );
          })
  }

  private resolveResponse(data, creationCallback: Callback = undefined,  dataInResponse: Callback = undefined) {
    if(creationCallback === undefined){
        return data;
    }

    if(dataInResponse !== undefined){
      return dataInResponse(data).map(p => creationCallback(p));
    }

    return data.map(p => creationCallback(p)); 
  }
}
