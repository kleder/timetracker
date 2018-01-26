import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { TimerService } from '../../../services/timer.service'
import { DataService } from '../../../services/data.service'
import { ApiService } from '../../../services/api.service'
import { WorkItemData } from 'app/models/RemoteAccount';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service'
import { AccountService } from '../../../services/account.service'

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  private unstoppedItem: any
  public todaySummaryItems: Array<any>
  private todayTimes: object
  private db: any
  public loader: boolean = true
  constructor(
    public databaseService: DatabaseService,
    private timerService: TimerService,
    private dataService: DataService,
    private api: ApiService,
    public router: Router,
    public httpService: HttpService,
    public account: AccountService    
  ) {
    this.todaySummaryItems = []
    this.todayTimes = {}
  }

  async ngOnInit() {
    var current = await this.account.Current();
    this.databaseService.getAllItems(current["id"]).then(rows => {
      if (rows) {   
        this.prepareItems(rows)
      }
    })
  }

  public prepareItems(rows) {
    let that = this
    let todayItems = []
    rows.forEach(function(row) {
      if (new Date(row.date).getDate() == new Date().getDate() && row.status == "stop") {
        todayItems.push(row)
      }
    })
    console.log("todayItems", todayItems)
    if (todayItems.length == 0) {
      this.loader = false
    }
    todayItems.forEach(function(row) {
      if (!that.todayTimes.hasOwnProperty(row.issueid)) {
        that.todayTimes[row.issueid] = row.duration
      } else {
        that.todayTimes[row.issueid] += row.duration
      }
    })
    let summaryProperties = Object.getOwnPropertyNames(this.todayTimes)
    console.log("summaryProperties", summaryProperties)
    summaryProperties.forEach(property => {
        that.api.getIssue(property).then(data => {       
          let newIssue = {
            id: data["id"],
            summary: data["field"].filter(field => field.name == "summary" )[0].value,
            agile: data["field"].filter(field => field.name == "sprint" )[0].value[0].id.split(":")[0],
            todaysTime: this.todayTimes[property]
          }
          that.todaySummaryItems.push(newIssue)
          that.loader = false    
        })
    })

  }

  async getIssueAndStart(issueId) {
    let account = await this.account.Current()    
    return new Promise(resolve => {
      this.api.getIssue(issueId).then(issue => {
        var newIssue : WorkItemData;
        newIssue = {
          accountId: account["id"],
          issueId: issue["id"],
          agile: issue.field.find(item => item.name == "sprint").value[0].id.split(":")[0],
          duration: 0,
          summary: issue.field.find(item => item.name == "summary" ).value,
          date: Date.now(),
          startDate: Date.now(),
          recordedTime: 0
        }
        this.timerService.startItem(newIssue)
      })
    })
  }

  public sendWorkItems = (issueId, item) => {
    this.timerService.stopItem().then(      
      (data)  => {
          this.dataService.timeSavedNotification('Your tracking has been saved!')
          this.dataService.timeSavedNotification('')
          this.databaseService.setIsPublished(item.date)
          this.databaseService.setIsStopped(item.date) 
      }, (err) =>{
          this.dataService.timeSavedNotification('An error occured.')
          this.dataService.timeSavedNotification('')
      }
    )
  }

  public goToBoards() {
    this.router.navigate(['../tracking'])
  }

}