import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { TimerService } from '../../../services/timer.service'
import { DataService } from '../../../services/data.service'
import { ApiService } from '../../../services/api.service'

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

  public startItem(issue, startTime=50) {
    console.log("start item from activity", issue)
    let startDate = Date.now()
    if (this.timerService.currentTime != undefined) {
      let currentId = this.timerService.currentIssueId
      // sendToApi
      this.sendWorkItems(this.timerService.currentIssueId, {date: this.timerService.startDate, duration: this.timerService.currentTime })
      // stop issueTimer && saveInDb 
      this.databaseService.stopItem(this.timerService.stopIssueTimer(), this.timerService.startDate)
      // stop idleTimer
      this.timerService.stopIdleTime() 
      if (issue["id"] == currentId) {
        // this.timerService.currentIssueId = undefined
        issue["time"] = 0
        return false
      }
    }
    this.timerService.turnTimer(issue, startDate)
    this.timerService.startidleTime(5)
    if (!issue.date) {
      console.log("start item")
      this.databaseService.startItem(issue, startDate)
    }
  }

  public getIssueAndStart(issueId) {
    return new Promise(resolve => {
      this.api.getIssue(issueId).then(issue => {
        let newIssue = {
          id: issue["id"],
          agile: "",
          comment: {},
          entityId: issue["entityId"],
          jiraId: issue["jiraId"],
          field: {},
          tag: issue["tag"],
          todaysTime: this.todayTimes[issue["id"]]
        }
        issue["comment"].forEach((comm, key) => {
          newIssue.comment[key] = comm
        })
        issue["field"].forEach((field, index) => {
          newIssue.field[field.name.replace(" ", "")] = field.value
        })
        newIssue.agile = newIssue.field["sprint"][0].id.split(":")[0]
        console.log("newIssue", newIssue)
        this.startItem(newIssue)
      })
    })
  }

  public sendWorkItems = (issueId, item) => {
    // let newItem = {
    //   date: item.date,
    //   duration: item.duration, 
    //   description: "Added by KlederTrack App",
    //   worktype: {
    //     name: "Testing"
    //   }
    // }
    this.api.createNewWorkItem(item, issueId).then(      
      response => {
        if (response["ok"]) {
          console.log("ok")
          this.databaseService.setIsPublished(item.date)
          this.databaseService.setIsStopped(item.date)
        }
      }
    )
  }

}


