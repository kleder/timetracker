import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subject } from 'rxjs/Subject'

@Injectable()
export class DataService {

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

  constructor() { }

  sentNotificationTime(data: number) {
    console.log("data", data)
    this.notificationTime.next(data)
  }

  sentIssueData(data: object) {
    console.log("data", data)
    this.issueData.next(data)
  }

  sentChosenAgiles(data: object) {
    console.log("data", data)
    this.agilesData.next(data)
  }

  sendUnstoppedItem(data: object) {
    console.log("data", data)
    this.unstoppedItem.next(data)
  }

  manageUnstoppedItem(data: object) {
    console.log("data", data)
    this.unstoppedWithAction.next(data)
  }

  timeSavedNotification(data: string) {
    console.log("data", data)
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

}
