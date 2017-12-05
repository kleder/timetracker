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
  public stoppedTime: number

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
      this.currentIssue.todaysTime++
      this.dataService.sentIssueData(
        { 
          currentTime: this.currentTime, 
          startDate: startDate
        })
    }, 1000);
  }

  public stopIssueTimer() {
    this.stoppedTime = this.currentTime
    if (this.stoppedTime < 60) {
      this.showModal()
    }
    this.currentTime = undefined
    this.currentIssueId = undefined
    clearInterval(this.issueTimer)
    return this.stoppedTime
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
      this.currentTime = this.updateTime(this.currentTime)
      this.currentIssue.todaysTime = this.updateTime(this.currentIssue.todaysTime)
    } 
    document.getElementById('afk-notification').style.display = "none"
  }

  public updateTime(time) {
    let updatedTime = time - Math.round(this.notificationTime)
    console.log("updated time: " + updatedTime)
    return updatedTime
  }

  public stopTrackingNotifications() {
    let currentItem = document.getElementById('current-item') 
    let content = document.getElementById('content')
    currentItem.className = "fade-out"
    content.className = content.className.replace("decrease", "increase")
    setTimeout(function() { 
      currentItem.className = currentItem.className.replace("fade-out", "hidden")
    }, 500);
  }

  public showModal() {
    document.getElementById('modal').style.display = "block"
  }

}
