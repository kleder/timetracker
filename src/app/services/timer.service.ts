import { Injectable } from '@angular/core';
const idle = require('idle');
import { DataService } from '../services/data.service'
import { ApiService } from '../services/api/api.service';
import { DatabaseService } from 'app/services/database.service';
import { WorkItem } from 'app/models/WorkItem';
import { ToasterService } from './toaster.service'
import { ApiProviderService } from './api/api-provider.service';
import { ApiInitService } from './api/api-init.service';
import { DateService } from './date.service';
import { BehaviorSubject } from 'rxjs';


const ipcRenderer = require('electron').ipcRenderer;
const path = require('path')

@Injectable()
export class TimerService {
  public currentWorkItem?: WorkItem

  private timerBehaviour = new BehaviorSubject<boolean>(false);
  onWorkItemTrackingStatusChanged = this.timerBehaviour.asObservable();

  public issueTimer: any
  public idleTimer: any
  public afkTime: number
  public notificationTime: number
  public hideHints: number
  private api: ApiService;

  constructor(
    public dataService: DataService,
    public databaseService: DatabaseService,
    public toasterService: ToasterService,
    private apiProviderService: ApiProviderService,
    private apiInitService: ApiInitService,
    private dateService: DateService

  ) {
    this.dataService.hideHints.subscribe(data => {
      this.hideHints = data
    })

    this.initApiService();

    // this.issueTimer = setInterval(() => {
    //   if (this.currentWorkItem) {
    //     this.timerBehaviour.next()
    //     // this.dataService.sentIssueData(
    //     //   {
    //     //     currentTime: this.currentIssue.duration,
    //     //     startDate: this.currentIssue.date
    //     //   })
    //   }
    // }, 1000);

    this.startidleTime(60 * 5)
  }

  private async initApiService() {
    await this.apiInitService.init();
    let that = this;
    this.api = this.apiProviderService.getInstance();
    // this.apiProviderService.getInstance().then(p => {
    //   that.api = p;
    // });
  }

  public turnTimer(issue) {
    this.currentWorkItem = issue
  }

  public stopIssueTimer() {
    if (this.currentWorkItem == undefined){
      return 0;
    }
    // var stoppedTime = this.currentIssue.duration
    // if (stoppedTime <= 10) {
    //   this.dataService.sendRecordTooShort(true)
    //   this.currentIssue = undefined      
    //   return 0
    // }
    // this.dataService.sendRecordTooShort(false)
    // if (stoppedTime <= 10 && !this.hideHints) {
    //   this.showModal()
    // } else if (stoppedTime > 10 && stoppedTime < 60) {
    //   this.currentIssue = undefined      
    //   return stoppedTime = 60
    // } 
    // this.currentIssue = undefined
    // return Math.ceil(stoppedTime/60)*60
  }

  public startidleTime(min) {
    this.idleTimer = setInterval(() => {
      if (this.currentWorkItem == undefined){
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
   // this.currentIssue.duration -= Math.round(this.notificationTime)
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


  public async startItem(issue: WorkItem): Promise<any> {
    if (this.currentWorkItem != undefined) {
      if (issue.issueId == this.currentWorkItem.issueId) {
        this.stopItem();
        return false
      }
      await this.stopItem();
    }
    this.trayChange(true);
    //issue.recordedTime = await this.databaseService.getRecordedTime(issue.issueId)
    return new Promise((resolve => {
      this.turnTimer(issue)
      // if (issue.duration < 60) {
      //   this.databaseService.startItem(issue)        
      // }
      resolve(issue);
    }))
  }

  public async startTracking(workItem: WorkItem) : Promise<any> {
      if(this.otherIssueIsNowTracked(workItem)){
        var current = this.currentWorkItem;
        this.stopTracking$(current);
      }

      this.currentWorkItem = workItem;
      this.databaseService.addWorkItem(this.currentWorkItem).
            then(workItemId => {
              this.currentWorkItem.id = workItemId
            });

      this.timerBehaviour.next(true);
  }


  private otherIssueIsNowTracked(workItem: WorkItem) {
    return this.currentWorkItem != null && this.currentWorkItem.issueId !== workItem.issueId;
  }

  private async syncWorkItem(workItem: WorkItem) : Promise<any> {
      this.api.createWorkItem(workItem).then(id => {
        workItem.timeTrackerId = id;
       this.databaseService.updateWorkItem(workItem)
      })
  }

  private async stopTracking$(workItem : WorkItem, saveRecord: boolean = true): Promise<any> {
    if(saveRecord){
      workItem.endDate = new Date(Date.now());
      workItem.duration = this.dateService.getDurationInSeconds(workItem.startDate, workItem.endDate);
      this.syncWorkItem(workItem);
    }
   
    this.timerBehaviour.next(false);
    this.currentWorkItem = null;
  }

  public stopTracking(saveRecord: boolean = true){
    this.stopTracking$(this.currentWorkItem, saveRecord);
  }

  public stopItem(): Promise<any> {
    this.trayChange(false)
    let issue = this.currentWorkItem;
    throw new DOMException();
    // issue.duration = this.stopIssueTimer()
    // if (issue.duration >= 60) {
    //   return this.api.createNewWorkItem(issue).then(
    //     data => {
    //       this.databaseService.stopItem(issue.duration, issue.startDate)
    //       this.databaseService.setIsPublished(issue.startDate)
    //       this.stopIdleTime()        
    //       this.stopTrackingNotifications()    
    //       this.toasterService.default('Your tracking has been saved!')          
    //     }, err => {
    //       this.toasterService.error('Can\'t report task to remote service.')          
    //     }
    // //   )
    // }
    // return new Promise<any>((resolve, reject) => {
    //   this.stopTrackingNotifications()                
    //   this.toasterService.error('Records shorter than 10 seconds will not be reported.')
    //   reject("To small amount of data");
    // })
  }

  

  private trayChange(recording: boolean) : void {
    let iconPath = ''    
    if (process.platform == 'darwin' || process.platform == 'linux') {
      iconPath = path.join(__dirname,  recording ? './assets/tray/osx/icon_tray-recording.png' : './assets/tray/osx/icon_tray-normal.png')
    }
    else if (process.platform == 'win32') {
      iconPath = path.join(__dirname,  recording  ? './assets/tray/win/icon_tray-normal.ico' : './assets/tray/win/icon_tray-normal.ico')
    }
    ipcRenderer.send('trayChange', iconPath);  
  }
}
