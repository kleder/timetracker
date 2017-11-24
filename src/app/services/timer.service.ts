import { Injectable } from '@angular/core';
const idle = require('idle');
import { DataService } from '../services/data.service'

@Injectable()
export class TimerService {
  public currentIssue: any
  public currentIssueId: string
  public startDate: number
  public currentTime: number
  public issueTimer: any
  public idleTimer: any
  public afkTime: number
  public notificationTime: number

  constructor(
    public dataService: DataService
  ) { 
    this.currentTime = undefined
  }

  public turnTimer(issue, startDate, startTime:number=0) {
    this.currentIssue = issue
    this.currentIssueId = issue.id
    this.startDate = startDate
    this.currentTime = startTime

    this.issueTimer = setInterval(() => { 
      this.currentTime++
      this.dataService.sentIssueData(
        { 
          currentTime: this.currentTime, 
          startDate: startDate
        })
    }, 1000);
  }

  public stopIssueTimer() {
    let stoppedTime = this.currentTime
    this.currentTime = undefined
    this.currentIssueId = undefined
    clearInterval(this.issueTimer)
    return stoppedTime
  }

  public startidleTime(min) {
    this.idleTimer = setInterval(() => {
      let seconds = idle.getIdleTime()/1000
      if (seconds < 1 && this.afkTime > min) {
        this.notificationTime = Math.round(this.afkTime)
        this.dataService.sentNotificationTime(this.notificationTime)
      }
      this.afkTime = seconds
      console.log("current afk: ", seconds)
    }, 1000);
  }

  public stopIdleTime () {
    console.log('stop idle timer')
    clearInterval(this.idleTimer)
    this.afkTime = 0
  }

  public showNotification() {
    document.getElementById('afk-notification').style.display = "unset"
  }

  public shouldAddAfkTime(r) {
    if (!r) {
      this.currentTime = this.updateTime()
    } 
    document.getElementById('afk-notification').style.display = "none"
  }

  public updateTime() {
    let updatedTime = this.currentTime - Math.round(this.notificationTime)
    console.log("updated time: " + updatedTime)
    return updatedTime
  }

}
