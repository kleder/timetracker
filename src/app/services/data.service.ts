import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class DataService {
  public routeBeforeMenu: string

  private notificationTime = new BehaviorSubject<number>(undefined)
  currentNotificationTime = this.notificationTime.asObservable()

  private issueData = new BehaviorSubject<object>({})
  currentIssueTime = this.issueData.asObservable()

  private agilesData = new BehaviorSubject<object>({})
  choosenAgiles = this.agilesData.asObservable()

  private unstoppedItem = new BehaviorSubject<object>({})
  currentUnstoppedItem = this.unstoppedItem.asObservable()

  private unstoppedWithAction = new BehaviorSubject<object>({})
  choosenAction = this.unstoppedWithAction.asObservable()

  private notificationMsg = new BehaviorSubject<string>("")
  notificationText = this.notificationMsg.asObservable()

  private agilesVisibility = new BehaviorSubject<object>({})
  agilesStates = this.agilesVisibility.asObservable()

  private currentAgilesVisibility = new BehaviorSubject<Array<any>>([])
  currentAgilesStates = this.currentAgilesVisibility.asObservable()

  private shouldHideHints = new BehaviorSubject<number>(0)
  hideHints = this.shouldHideHints.asObservable()

  private recordTooShort = new BehaviorSubject<boolean>(undefined)
  recTooShort = this.recordTooShort.asObservable()

  private isInternetConnection = new BehaviorSubject<boolean>(true)
  netConnection = this.isInternetConnection.asObservable()

  constructor() { }

  sentNotificationTime(data: number) {
    this.notificationTime.next(data)
  }

  sentIssueData(data: object) {
    this.issueData.next(data)
  }

  sendChosenAgiles(data: object) {
    this.agilesData.next(data)
  }

  sendUnstoppedItem(data: object) {
    this.unstoppedItem.next(data)
  }

  manageUnstoppedItem(data: object) {
    this.unstoppedWithAction.next(data)
  }

  timeSavedNotification(data: string) {
    this.notificationMsg.next(data)
  }
  
  sendAgilesVisibility(data: object) {
    this.agilesVisibility.next(data)
  }

  sendCurrentAgilesVisibility(data: Array<any>) {
    this.currentAgilesVisibility.next(data)
  }

  sendHideHints(data: number) {
    this.shouldHideHints.next(data)
  }

  sendRecordTooShort(data: boolean) {
    this.recordTooShort.next(data)
  }

  internetConnection(data: boolean) {
    this.isInternetConnection.next(data)
  }

}
