import { Injectable } from '@angular/core';
const idle = require('idle');
import { DataService } from '../services/data.service'
import { ApiService } from 'app/services/api.service';
import { DatabaseService } from 'app/services/database.service';
import { WorkItemData } from 'app/models/RemoteAccount';
import { ToasterService } from './toaster.service'
const ipcRenderer = require('electron').ipcRenderer;
const path = require('path')

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

    this.startidleTime(60 * 5)
  }

  public turnTimer(issue) {
    this.currentIssue = issue
  }

  public stopIssueTimer() {
    if (this.currentIssue == undefined){
      return 0;
    }
    var stoppedTime = this.currentIssue.duration
    if (stoppedTime <= 10) {
      this.dataService.sendRecordTooShort(true)
      this.currentIssue = undefined      
      return 0
    }
    this.dataService.sendRecordTooShort(false)
    if (stoppedTime <= 10 && !this.hideHints) {
      this.showModal()
    } else if (stoppedTime > 10 && stoppedTime < 60) {
      this.currentIssue = undefined      
      return stoppedTime = 60
    } 
    this.currentIssue = undefined
    return Math.ceil(stoppedTime/60)*60
  }

  public startidleTime(min) {
    this.idleTimer = setInterval(() => {
      if (this.currentIssue == undefined){
        return;
      }

      let seconds = idle.getIdleTime() / 1000
      if (seconds < 1 && this.afkTime > min) {
        this.notificationTime = Math.round(this.afkTime)
        this.dataService.sentNotificationTime(this.notificationTime)
      }
      this.afkTime = seconds
    }, 1000);
  }

  public stopIdleTime() {
    this.afkTime = 0
  }

  public shouldAddAfkTime(r) {
    if (!r) {
      this.updateTime()
    }
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
      if (issue.issueId == this.currentIssue.issueId) {
        this.stopItem();
        return false
      }
      await this.stopItem();
    }
    this.trayRecording()
    issue.recordedTime = await this.databaseService.getRecordedTime(issue.issueId)
    return new Promise((resolve => {
      this.turnTimer(issue)
      if (issue.duration < 60) {
        this.databaseService.startItem(issue)        
      }
      resolve(issue);
    }))

  }

  public stopItem(): Promise<any> {
    this.trayDefault()
    let issue = this.currentIssue;
    issue.duration = this.stopIssueTimer()
    if (issue.duration >= 60) {
      return this.api.createNewWorkItem(issue).then(
        data => {
          this.databaseService.stopItem(issue.duration, issue.startDate)
          this.databaseService.setIsPublished(issue.startDate)
          this.stopIdleTime()        
          this.stopTrackingNotifications()    
          this.toasterService.default('Your tracking has been saved!')          
        }, err => {
          this.toasterService.error('Can\'t report task to remote service.')          
        }
      )
    }
    return new Promise<any>((resolve, reject) => {
      this.stopTrackingNotifications()                
      this.toasterService.error('Records shorter than 10 seconds will not be reported.')
      reject("To small amount of data");
    })
  }

  public trayRecording() {
    let iconPath = ''    
    if (process.platform == 'darwin' || process.platform == 'linux') {
      iconPath = path.join(__dirname, './assets/tray/osx/icon_tray-recording.png')
    }
    else if (process.platform == 'win32') {
      iconPath = path.join(__dirname, './assets/tray/win/icon_tray-normal.ico')}
    ipcRenderer.send('trayChange', iconPath);
  }

  public trayDefault() {
    let iconPath = ''    
    if (process.platform == 'darwin' || process.platform == 'linux') {
      iconPath = path.join(__dirname, './assets/tray/osx/icon_tray-normal.png')
    }
    else if (process.platform == 'win32') {
      iconPath = path.join(__dirname, './assets/tray/win/icon_tray-normal.ico')
    }
    ipcRenderer.send('trayChange', iconPath); 
  }
}
