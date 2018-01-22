import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpService } from '../services/http.service'
import { AccountService } from './account.service'
import { RemoteAccount, UserData, IssueDetails, WorkItemData } from 'app/models/RemoteAccount';
import { error } from 'util';
import { reject } from 'q';
import { resolve } from 'dns';
@Injectable()
export class ApiService {

  constructor(
    public http: HttpService,
    public accounts: AccountService
  ) {
     this.UseAccount();
  }

  public async UseAccount(remoteAccount?: RemoteAccount) {
    if (remoteAccount == undefined) {
      var remoteAccount = await this.accounts.Current();      
    }
    if (remoteAccount != undefined){
      this.http.UseAccount(remoteAccount);
    }
    return;
  }

  getAllProjects = () => {
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/admin/project')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error)
          });
      });
    });
  }

  getAllAgiles = () => {
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/admin/agile')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, error => {
            resolve(error)
          });
      });
    });
  }

  getIssuesByProject = (id) => {
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/issue/byproject/' + id + '?filter=for%3A+me')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data)
          })
      })
    })
  }

  getIssuesByAgile = (agileName) => {
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/issue?filter=for:me+Board+' + agileName + ':+{Current+sprint}+#Unresolved&max=50')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data)
          })
      })
    })
  }

  getIssue = (issueId) => {
    return new Promise<IssueDetails>(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/issue/' + issueId + '?wikifyDescription=true')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data)
          })
      })
    })
  }

  getSprintInfo = (agile) => {
    console.log(agile)
    let query = agile.url.split("/youtrack")[1]
    console.log(query)
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get(query)
          .map(res => res.json())
          .subscribe(data => {
            resolve(data)
          })
      })
    })
  }

  createNewWorkItem = (data : WorkItemData) => {
    let newItem = {
      date: data.date,
      duration: Math.round(data.duration / 60),
      description: "Added by T-Rec App"
    }
    console.log(data)

    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.post('/rest/issue/' + data.issueId + '/timetracking/workitem', newItem)
          .subscribe(data => {
            resolve(data)
          }, error => {
            resolve(error)
          })
      })
    })
  }

  getWorkItem = (issueId) => {
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/issue/' + issueId + '/timetracking/workitem')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data)
          })
      })
    })
  }

  getTimetrackingWorkTypes = (projectId) => {
    return new Promise(resolve => {
      this.UseAccount().then(() => {
        this.http.get('/rest/admin/project/' + projectId + '/timetracking/worktype')
          .map(res => res.json())
          .subscribe(data => {
            resolve(data)
          })
      })
    })
  }

  getCurrentUser(remoteAccount: RemoteAccount) {
    this.UseAccount(remoteAccount)
    this.http.UseAccount(remoteAccount)
    return new Promise((resolve, reject) => {
      this.http.get('/rest/user/current')
        .map(res => res.json())
        .subscribe(data => { 
          resolve(data) 
        }, error => {
          reject(error) 
        } 
      );
    })
  }

}