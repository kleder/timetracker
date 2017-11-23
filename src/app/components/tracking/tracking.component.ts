import { Component, OnInit } from '@angular/core';
import { DashboardComponent }  from './dashboard/dashboard.component';
import { ActivityComponent }    from './activity/activity.component';
import { TimerService } from '../../services/timer.service'
import { DataService } from '../../services/data.service'
import { DatabaseService } from '../../services/database.service'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  public notificationTime: number
  public issueTime: number
  private allItemsFromDb: any
  private unstoppedItem: any

  constructor(
    public timerService: TimerService,
    public dataService: DataService,
    public databaseService: DatabaseService,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.subscribeNotificationTime()
    this.subscribeIssueTime()
    this.subscribeUnstoppedItem()
  }

  subscribeNotificationTime() {
    this.dataService.currentNotificationTime.subscribe(data => {
      console.log(data)
      this.notificationTime = data
      if (this.notificationTime != undefined) {
        this.showNotification()
      }
    })
  }

  subscribeIssueTime() {
    this.dataService.currentIssueTime.subscribe(data => {
      let issueTime = data["currentTime"]
      let startDate = data["startDate"]
      console.log("issueTime", issueTime)
      if (issueTime % 60 === 0) {
        this.databaseService.updateDuration(Math.round(issueTime), startDate)
      }
    })
  }

  subscribeUnstoppedItem() {
    this.dataService.currentUnstoppedItem.subscribe(data => {
      this.unstoppedItem = data
      if (Object.keys(this.unstoppedItem).length != 0) {
        this.showUnstoppedItem()
      }
      console.log("unstoppedItem observble", this.unstoppedItem)
    })
  }

  public manageUnstoppedItem = (action) => {
    this.unstoppedItem.action = action
    console.log("in tracking", action)
    this.dataService.manageUnstoppedItem(this.unstoppedItem)
  }

  public stopTracking = (issue) => {
    console.log("issue in tracking comp", issue)
    // sendToApi
    this.sendWorkItems(this.timerService.currentIssueId, {date: this.timerService.startDate, duration: this.timerService.currentTime })
    // stop issueTimer && saveInDb 
    this.databaseService.stopItem(this.timerService.stopIssueTimer(), this.timerService.startDate)
    // stop idleTimer
    this.timerService.stopIdleTime() 
  }

  public sendWorkItems = (issueId, item) => {
    console.log("issueId", issueId)
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

  public showNotification() {
    document.getElementById('afk-notification').style.display = "unset"
  }

  public showUnstoppedItem() {
    document.getElementById('unstopped-item').style.display = "unset"
  }

  public hideUnstoppedNotification() {
    document.getElementById('unstopped-item').style.display = "none"
  }

}
