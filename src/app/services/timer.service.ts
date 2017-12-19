import { Injectable } from '@angular/core';
const idle = require('idle');
import { DataService } from '../services/data.service'
import { ApiService } from 'app/services/api.service';
import { DatabaseService } from 'app/services/database.service';
import { WorkItemData } from 'app/models/RemoteAccount';
import { ToasterService } from './toaster.service'

@Injectable()
export class TimerService {
  public currentIssue?: WorkItemData
  public issueTimer: any
  public idleTimer: any
  public afkTime: number
  public notificationTime: number
  public hideHints: number

  constructor(
    public dataService: DataService,
    public api: ApiService,
    public databaseService: DatabaseService,
    public toasterService: ToasterService
  ) {
    this.dataService.hideHints.subscribe(data => {
      this.hideHints = data
    })
  }

  public turnTimer(issue) {
    this.currentIssue = issue

    this.issueTimer = setInterval(() => {
      if (this.currentIssue) {
        this.currentIssue.duration++;
        this.currentIssue.recordedTime++;
        this.dataService.sentIssueData(
          {
            currentTime: this.currentIssue.duration,
            startDate: this.currentIssue.date
          })
      }
    }, 1000);
  }

  public stopIssueTimer() {
    var stoppedTime = this.currentIssue.duration
    if (stoppedTime < 60 && !this.hideHints) {
      this.showModal()
    }
    this.currentIssue = undefined
    clearInterval(this.issueTimer)
    return stoppedTime
  }

  public startidleTime(min) {
    this.idleTimer = setInterval(() => {
      let seconds = idle.getIdleTime() / 1000
      if (seconds < 1 && this.afkTime > min) {
        this.notificationTime = Math.round(this.afkTime)
        this.dataService.sentNotificationTime(this.notificationTime)
      }
      this.afkTime = seconds
    }, 1000);
  }

  public stopIdleTime() {
    clearInterval(this.idleTimer)
    this.afkTime = 0
  }

  public showNotification() {
    document.getElementById('afk-notification').style.display = "unset"
  }

  public shouldAddAfkTime(r) {
    if (!r) {
      this.updateTime()
    }
    document.getElementById('afk-notification').style.display = "none"
  }

  public updateTime() {
    this.currentIssue.duration -= Math.round(this.notificationTime)
  }

  public stopTrackingNotifications() {
    let currentItem = document.getElementById('current-item')
    let content = document.getElementById('content')
    currentItem.className = "fade-out"
    content.className = content.className.replace("decrease", "increase")
    setTimeout(function () {
      currentItem.className = currentItem.className.replace("fade-out", "hidden")
    }, 500);
  }

  public showModal() {
    document.getElementById('modal').style.display = "block"
  }


  public async startItem(issue: WorkItemData): Promise<any> {
    if (this.currentIssue != undefined) {
      await this.stopItem();
    }
    issue.recordedTime = await this.databaseService.getRecordedTime(issue.issueId)
    return new Promise((resolve => {
      this.turnTimer(issue)
      this.startidleTime(60 * 5)
      this.databaseService.startItem(issue)
      resolve(issue);
    }))

  }

  public stopItem(): Promise<any> {
    let issue = this.currentIssue;
    console.log(issue)
    let stoppedTime = this.stopIssueTimer()
    if (stoppedTime >= 60) {
      // sendToApi
      //this.sendWorkItems(this.currentIssueId, {date: startDate, duration: this.currentTime })

      return this.api.createNewWorkItem(issue).then(
        data => {
          this.stopIdleTime()
          // stop issueTimer && saveInDb 
          this.databaseService.stopItem(stoppedTime, issue.startDate)
          this.stopTrackingNotifications()          
          this.toasterService.showToaster('Your tracking has been saved!', 'default')          
        }, err => {
          this.toasterService.showToaster('An error occured.', 'error')          
        }
      )
    }
    return new Promise<any>((resolve, reject) => {
      this.stopTrackingNotifications()                
      this.toasterService.showToaster('Records shorter than 1 minute will not be reported.', 'error')
      reject("To small amount of data");
    })
  }


}
