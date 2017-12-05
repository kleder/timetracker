import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardComponent }  from './dashboard/dashboard.component';
import { ActivityComponent }    from './activity/activity.component';
import { TimerService } from '../../services/timer.service'
import { DataService } from '../../services/data.service'
import { DatabaseService } from '../../services/database.service'
import { ApiService } from '../../services/api.service'
import { SecondsToTimePipe } from '../../pipes/seconds-to-time.pipe'

import { Router } from '@angular/router';
const notifier = require('electron-notifications')

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnDestroy, OnInit {
  public notificationTime: number
  public issueTime: number
  private allItemsFromDb: any
  public unstoppedItem: any
  public notificationText: string
  alive: boolean = true;
  public agilesStates: Array<any>
  public hideHints: boolean
  secondsToTimePipe = new SecondsToTimePipe()

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
    this.subscribeAgilesStates()
  }

  ngOnDestroy() {
    this.alive = false
  }

  subscribeNotificationTime() {
    this.dataService.currentNotificationTime.takeWhile(() => this.alive).subscribe(data => {
      console.log(data)
      this.notificationTime = data
      if (this.notificationTime != undefined) {
        this.showInactiveNotification()
      }
    })
  }

  subscribeIssueTime() {
    this.dataService.currentIssueTime.takeWhile(() => this.alive).subscribe(data => {
      let issueTime = data["currentTime"]
      let startDate = data["startDate"]
      console.log("issueTime", issueTime)
      if (issueTime % 60 === 0) {
        this.databaseService.updateDuration(Math.round(issueTime), startDate)
      }
      if (this.timerService.currentIssueId) {
        let element = document.getElementById('current-item') 
        element.className = "show"
        let content = document.getElementById('content')
        content.className = "content decrease"
      }
    })
  }

  subscribeUnstoppedItem() {
    this.dataService.currentUnstoppedItem.takeWhile(() => this.alive).subscribe(data => {
      this.unstoppedItem = data
      if (Object.keys(this.unstoppedItem).length != 0) {
        this.showModal()
      }
      console.log("unstoppedItem observble", this.unstoppedItem)
    })
  }

  public subscribeNotification() {
    this.dataService.notificationText.takeWhile(() => this.alive).subscribe(text => {
      console.log("subscribeNotification", text)
      if (text) {
        this.timeSavedNotification(text)
      }
    })
  }

  public subscribeAgilesStates() {
    let that = this
    this.agilesStates = []
    this.dataService.agilesStates.takeWhile(() => this.alive).subscribe(currentAgile => {
      if (Object.keys(currentAgile).length > 0) {
        this.agilesStates.push(currentAgile)
      }

      this.agilesStates.forEach(agile => {
       (agile.name == currentAgile["name"])? agile.state = currentAgile["state"] : ""
      })

      this.agilesStates = this.agilesStates.filter((thing, index, self) => 
        index === self.findIndex((t) => (
          t.name === thing.name
        ))
      )
      console.log("this.agilesStates", this.agilesStates)
      this.dataService.sendCurrentAgilesVisibility(this.agilesStates)
    })
  }

  public manageUnstoppedItem = (action) => {
    this.unstoppedItem.action = action
    console.log("in tracking", action)
    this.dataService.manageUnstoppedItem(this.unstoppedItem)
    this.unstoppedItem = undefined
  }

  public stopTracking = (issue) => {
    this.timerService.stopTrackingNotifications()
    let stoppedTime = this.timerService.stopIssueTimer()
    console.log("this.stoppedTime", stoppedTime)
    // stop idleTimer
    this.timerService.stopIdleTime() 
    if (stoppedTime >= 60) {
      console.log("issue in tracking comp", issue)
      // sendToApi
      this.sendWorkItems(this.timerService.currentIssueId, {date: this.timerService.startDate, duration: this.timerService.currentTime })
      // stop issueTimer && saveInDb 
      this.databaseService.stopItem(stoppedTime, this.timerService.startDate)
    }
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

  public showInactiveNotification() {
    const notification = notifier.notify('You were inactive', {
      message: 'What should I do with ' + this.secondsToTimePipe.transform(this.timerService.notificationTime) + '?',
      buttons: ['Add', 'Remove'],
      // icon: '',
      duration: 30000
    })
    
    notification.on('swipedRight', () => {
      notification.close()
    })

    notification.on('buttonClicked', (text, buttonIndex, options) => {
      if (text === 'Remove') {
        this.timerService.shouldAddAfkTime(false)
      }
      notification.close()
    })

  }

  public timeSavedNotification(text: string) {
    console.log("in timeSavedNotification", text)
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

  public changeHintVisibility(hideHint) {
    this.hideHints = hideHint
    console.log(this.hideHints)
  }

  public showModal() {
    document.getElementById('modal').style.display = "block"
  }

  public hideModal() {
    document.getElementById('modal').style.display = "none"
  }

}
