import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardsComponent }  from './boards/boards.component';
import { RecordsComponent }    from './records/records.component';
import { TimerService } from '../../services/timer.service'
import { DataService } from '../../services/data.service'
import { DatabaseService } from '../../services/database.service'
import { SecondsToTimePipe } from '../../pipes/seconds-to-time.pipe'
import { ToasterService } from '../../services/toaster.service'
import { versions } from '../../../environments/versions'

import { Router, ActivatedRoute } from '@angular/router';
import { WorkItem } from 'app/models/WorkItem';
import { ApiProviderService } from '../../services/api/api-provider.service';
import { ApiService } from '../../services/api/api.service';
import { Board } from '../../models/Board';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { TrecOnInit } from '../TrecOnInit';
import { ApiInitService } from '../../services/api/api-init.service';
import { AccountService } from '../../services/account.service';
import { DbMemoryCacheService } from '../../services/db-memory-cache.service';
const notifier = require('electron-notifications')
const path = require('path')

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent extends TrecOnInit implements OnDestroy {
  private accountId: any;
  private obs: Subscription;
  public notificationTime: number
  public unstoppedItem: any
  private alive: boolean = true;
  public hintsCheckbox: boolean
  public hideHints: number
  secondsToTimePipe = new SecondsToTimePipe()
  public differentVersion = false;
  public recordTooShort: boolean
  public internetConnection: boolean;

  public elapsed: number = 0;

  public currentWorkItem : WorkItem;
  public currentTaskName: string;

  constructor(
    public timerService: TimerService,
    public dataService: DataService,
    public databaseService: DatabaseService,
    public router: Router,
    public toasterService: ToasterService,
    protected apiProviderService: ApiProviderService,
    private activatedRoute: ActivatedRoute,
    protected apiInitService: ApiInitService,
    protected accountService: AccountService,
    private dbMemoryCacheService: DbMemoryCacheService
  ) {
    super(apiProviderService, apiInitService, accountService);
    this.checkVersion()
   }

  async ngOnInit() {
    await super.ngOnInit();

    this.getVariables()
    this.internetConnection = true;
    this.subscriptWorkItemTrackingChanged()
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.accountId = params["accountId"];
    });
  }

  ngOnDestroy() {
    this.alive = false
  }

  public getTimeSpentTodayOnTask(issue: WorkItem) : number {
    return this.dbMemoryCacheService.getTimeSpentTodayOnTask(issue.issueId);
  }

  public getIssueName(workItem: WorkItem): string {
    return this.dbMemoryCacheService.getTask(workItem.issueId).summary;
  }

  subscriptWorkItemTrackingChanged(): any {
    this.timerService.onWorkItemTrackingStatusChanged.subscribe(data => {
      if(data == true){
        this.workItemStarted();
      
      } else {
         this.stopTracking$();
         this.currentWorkItem = undefined;

         let content = document.getElementById('content')
            content.className = "content increase"
       }
    })
  }

  private workItemStarted() {
    this.elapsed = 0;
    this.currentWorkItem = this.timerService.currentWorkItem;
    this.startWorkItemTimer();
    this.showTrackingElement();
  }

  private startWorkItemTimer(): any
   {
     let that = this;
     this.obs = Observable.interval(1000).subscribe((x) => {
       that.elapsed = x;

       this.updateLastUpdateEveryMinute(that);
     })
  }

  private updateLastUpdateEveryMinute(that: this) {
    if ((that.elapsed % 60) === 0) {
      that.timerService.currentWorkItem.lastUpdate = new Date(Date.now());
      that.databaseService.updateWorkItemLastUpdate(that.timerService.currentWorkItem);
    }
  }

  private stopTracking$(){
   this.manageTrackingElement("hide");
   if(this.obs != undefined) this.obs.unsubscribe();
  }

  public stopTracking(){
    if(this.elapsed < 60){
      this.showModal();
    } else {
      this.timerService.stopTracking();
      this.hideModal();

      this.dbMemoryCacheService.forceSync();

    }
  }

  public ignoreTracking(){
      this.databaseService.deleteWorkItem(this.currentWorkItem);
      this.timerService.stopTracking(false);
      this.hideModal();
  }
  
  private showTrackingElement(){
    this.manageTrackingElement("show");
  }


  private manageTrackingElement(itemClassName: string){
    let element = document.getElementById('current-item');
    element.className = itemClassName;
    let content = document.getElementById('content');
    content.className = `content decrease`;
  }

  private checkVersion(){
    // this.api.getVersionInfo().then(data => {
    //   if (data.tag_name != undefined && data.tag_name.replace("v","") !== versions.version){
    //     this.differentVersion = true
    //   }
    // })
  }

  private subscribeInternetConnection() {
    this.dataService.netConnection.takeWhile(() => this.alive).subscribe(data => {
      this.internetConnection = data
    })
  }

  private subscribeNotificationTime() {
    this.dataService.currentNotificationTime.takeWhile(() => this.alive).subscribe(data => {
      this.notificationTime = data
      if (this.notificationTime != undefined) {
        this.showInactiveNotification()
      }
    })
  }

  public manageUnstoppedItem = (action) => {
    var item = new WorkItem;
    item.issueId = this.unstoppedItem.issueid
    // item.duration = this.unstoppedItem.duration
    // item.date = Date.now();
    // item.startDate = this.unstoppedItem.date,
    // item.summary = this.unstoppedItem.Summary
    if (action == 'remove') {
    //  this.databaseService.deleteItem(item.startDate)
      this.hideModal()
      this.toasterService.default('Your tracking has been removed!')
    }
    if (action == 'resume') {
      this.timerService.startItem(item);
      this.hideModal()
      document.getElementById('modal').style.display = "none"
    }
    if (action == 'add') {
      // this.api.createNewWorkItem(item).then(data => {
      //   this.databaseService.stopItem(item.duration, item.startDate)
      //   this.databaseService.setIsPublished(item.startDate)    
      //   this.hideModal()             
      //   this.toasterService.default('Your tracking has been saved!')  
      // })      
    }
    this.unstoppedItem = undefined
  }

 

  public goToEditAccount() {
    this.router.navigate(['accounts/edit-account'], { queryParams: {  accountId : this.accountId} });
  }

  public showInactiveNotification() {
    const notification = notifier.notify('You were inactive', {
      message: 'What should I do with ' + this.secondsToTimePipe.transform(this.timerService.notificationTime) + '?',
      buttons: ['Add', 'Remove'],
      icon: path.resolve(__dirname, 'assets/icons/favicon.png'),
      duration: 60000
    })
    notification.on('swipedRight', () => {
      notification.close()
      this.clearInactiveTime()
    })
    notification.on('buttonClicked', (text, buttonIndex, options) => {
      if (text === 'Remove') {
        this.timerService.shouldAddAfkTime(false)
      }
      notification.close()
      this.clearInactiveTime()
    })
  }

  public clearInactiveTime() {
    this.dataService.sentNotificationTime(undefined)
  }

  public getVariables() {
    // this.databaseService.getVariables().then(data => {
    //   if (data) {
    //     this.hideHints = parseInt(data["value"])
    //     this.dataService.sendHideHints(this.hideHints)
    //   }
    // })
  }

  public changeHintVisibility(hideHint) {
    (hideHint)? hideHint = 1: hideHint = 0
   // this.databaseService.updateVariable({name: 'hide_hints', value: hideHint})
  }

  public showModal() {
    document.getElementById('modal').style.display = "block"
  }

  public hideModal() {
    document.getElementById('modal').style.display = "none"
    this.getVariables()
  }

}
