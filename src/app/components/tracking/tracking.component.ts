import { Component, OnInit } from '@angular/core';
import { DashboardComponent }  from './dashboard/dashboard.component';
import { ActivityComponent }    from './activity/activity.component';
import { TimerService } from '../../services/timer.service'
import { DataService } from '../../services/data.service'
import { DatabaseService } from '../../services/database.service'
import { ApiService } from '../../services/api.service'

import { Router } from '@angular/router';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  public notificationTime: number
  public issueTime: number
  private allItemsFromDb: any
  public unstoppedItem: any
  public notificationText: string

  constructor(
    public timerService: TimerService,
    public dataService: DataService,
    public databaseService: DatabaseService,
    public api: ApiService,
    public router: Router
  ) { }

  ngOnInit() {
    this.subscribeNotificationTime()
    this.subscribeIssueTime()
    this.subscribeUnstoppedItem()
    this.subscribeNotification()
  }

  subscribeNotificationTime() {
    this.dataService.currentNotificationTime.subscribe(data => {
      console.log(data)
      this.notificationTime = data
      if (this.notificationTime != undefined) {
        this.showAfkNotification()
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
      if (issueTime) {
        let element = document.getElementById('current-item') 
        element.className = "show"
        let content = document.getElementById('content')
        content.className = "content decrease"
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

  public subscribeNotification() {
    this.dataService.notificationText.subscribe(text => {
      console.log(text)
      if (text) {
        this.timeSavedNotification(text)
      }
    })
  }

  public manageUnstoppedItem = (action) => {
    this.unstoppedItem.action = action
    console.log("in tracking", action)
    this.dataService.manageUnstoppedItem(this.unstoppedItem)
  }

  public stopTracking = (issue) => {
    this.timerService.stopTrackingNotifications()
    console.log("issue in tracking comp", issue)
    // sendToApi
    this.sendWorkItems(this.timerService.currentIssueId, {date: this.timerService.startDate, duration: this.timerService.currentTime })
    // stop issueTimer && saveInDb 
    this.databaseService.stopItem(this.timerService.stopIssueTimer(), this.timerService.startDate)
    // stop idleTimer
    this.timerService.stopIdleTime() 
  }

  public sendWorkItems = (issueId, item) => {
    let that = this
    console.log("issueId", issueId)
    this.api.createNewWorkItem(item, issueId).then(      
      response => {
        if (response["ok"]) {
          console.log("ok")
          this.databaseService.setIsPublished(item.date)
          this.databaseService.setIsStopped(item.date)
            that.timeSavedNotification('Your tracking has been saved!')
        } else {
          this.timeSavedNotification('An error occured.')
        }
      }
    )
  }

  public chooseAgiles() {
    this.router.navigateByUrl('/boards');    
  }

  public logOut() {
    this.router.navigateByUrl('');    
  }

  public showAfkNotification() {
    document.getElementById('afk-notification').style.display = "unset"
  }

  public showUnstoppedItem() {
    document.getElementById('unstopped-item').style.display = "unset"
  }

  public hideUnstoppedNotification() {
    document.getElementById('unstopped-item').style.display = "none"
  }

  public timeSavedNotification(text: string) {
    let that = this
    setTimeout(function() { 
      that.notificationText = text
      let element = document.getElementById("default-notification")
      element.className = "show";
      setTimeout(function() { 
        element.className = element.className.replace("show", "")
      }, 2500);
    }, 300)
  }

}
