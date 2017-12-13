import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { TimerService } from '../../../services/timer.service'
import { DataService } from '../../../services/data.service'
import { ApiService } from '../../../services/api.service'
import { WorkItemData } from 'app/models/RemoteAccount';

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
  
  constructor(
    public databaseService: DatabaseService,
    private timerService: TimerService,
    private dataService: DataService,
    private api: ApiService
  ) {
    this.todaySummaryItems = []
    this.todayTimes = {}
  }

  ngOnInit() {
    this.databaseService.getAllItems().then(rows => {
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
          console.log(data)         
          let newIssue = {
            id: data["id"],
            summary: data["field"].filter(field => field.name == "summary" )[0].value,
            agile: data["field"].filter(field => field.name == "sprint" )[0].value[0].id.split(":")[0],
            todaysTime: this.todayTimes[property]
          }
          console.log("new Issue", newIssue)
          that.todaySummaryItems.push(newIssue)        
        })
    })
  }

 
  public getIssueAndStart(issueId) {
    return new Promise(resolve => {
      this.api.getIssue(issueId).then(issue => {
        var newIssue : WorkItemData;
        newIssue = {
          issueId: issue["id"],
          agile: "",
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

}