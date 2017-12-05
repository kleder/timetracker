import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { TimerService } from '../../../services/timer.service';
import { DataService } from '../../../services/data.service'
import { DatabaseService } from '../../../services/database.service'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpService } from '../../../services/http.service'

const electron = require('electron')
const ipc = electron.ipcRenderer

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ maxHeight: '1000px', transition: 'max-height .3s ease-in', overflow: 'hidden' })),
      state('hidden', style({ maxHeight: '0', transition: 'max-height .3s ease-out', overflow: 'hidden'}))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  public projects: any
  private projectId: String
  private issues: any
  private newItemProperties: any
  private workTypes: any
  private currentIssueId: String
  private unstoppedItem: any
  private allItemsFromDb: any
  public agiles: any
  private totalTimes: object

  constructor(
    public api: ApiService,
    public timerService: TimerService,
    public dataService: DataService,
    public databaseService: DatabaseService,
    public httpService: HttpService
  ) { 
    this.newItemProperties = {
      date: 0,
      duration: 0
    }
  }

  toggle(i) {
    if (this.agiles[i].issues != 0) {
      if (this.agiles[i].visiblityState === 'hidden')
        this.agiles[i].visiblityState = 'shown'
      else
        this.agiles[i].visiblityState = 'hidden'
      this.dataService.sendAgilesVisibility({name: this.agiles[i].name, state: this.agiles[i].visiblityState})
    }
  }
  
  ngOnInit() {
    this.dataService.choosenAgiles.subscribe(data => {
      this.agiles = data
      // this.getAllAgiles()
      this.getItemsFromDb()
    })
    // this.getItemsFromDb()
  }
  
  public getItemsFromDb() {
    let that = this
    this.totalTimes = {}
    this.databaseService.getAllItems().then(data => {
      console.log("resolve from db", data)
      this.allItemsFromDb = data
      this.allItemsFromDb.forEach(function(row) {
        if (that.timerService.currentIssueId == undefined && row.status == "start" && row.published == 0 && row.duration > 0) {
          that.dataService.sendUnstoppedItem(row)
          that.dataService.choosenAction.subscribe(itemWithAction => {
            that.manageUnstoppedItem(itemWithAction, itemWithAction["action"])
          })
        }
        let todayItems = []
        if (new Date(row.date).getDate() == new Date().getDate() && row.status == "stop") {
          todayItems.push(row)
        }
        console.log("todayItems", todayItems)
        todayItems.forEach(function(row) {
          if (!that.totalTimes.hasOwnProperty(row.issueid)) {
            that.totalTimes[row.issueid] = row.duration
          } else {
            that.totalTimes[row.issueid] += row.duration
          }
        })
        console.log("that.totalTimes", that.totalTimes)

      })  
      this.getAllAgiles()
    })
  }

  public getAllAgiles() {
    let that = this
    this.agiles.forEach((agile, index) => {
      that.dataService.currentAgilesStates.subscribe(agilesStates => {
        agilesStates.forEach(agileState => {
          (agile.name == agileState)? agile.visiblityState = agileState.state : "shown"
        })
      })
      if (agile.visiblityState == '' ) {
        agile.visiblityState = 'shown'
      }
      if (agile.checked) {
        this.dataService.sendAgilesVisibility({name: agile.name, state: agile.visiblityState})  
      }    
      agile.issues = []
      console.log(agile, index)
      if (agile.checked) {
        this.getIssuesByAgile(agile.name, index)
      }
    })
  }

  public getIssuesByAgile(agileName, index, after=0, max=10) {
    this.api.getIssuesByAgile(agileName).then(
      data => {
          this.issues = data
          this.prepareIssues(this.issues, agileName, index)
      }
    )
  }

  public prepareIssues = (issues, agileName, agileIndex) => {
    let that = this
    console.log("issues", issues, )
    console.log(" agileName", agileName)
    console.log("agileIndex", agileIndex)    
    let tempIssues = []
    issues.issue.forEach((issue, index) => {
      var newIssue = {
        id: issue.id,
        agile: agileName,
        comment: {},
        hasComment: undefined,
        hasDescription: undefined,
        entityId: issue.entityId,
        jiraId: issue.jiraId,
        field: {},
        tag: issue.tag,
        todaysTime: that.totalTimes[issue.id] || 0
      }
      issue.comment.forEach((comm, key) => {
        newIssue.comment[key] = comm
      })
      issue.field.forEach((field, index) => {
        newIssue.field[field.name.replace(" ", "")] = field.value
      })
      newIssue.field["Est"] = this.convertEstimate(newIssue.field["Est"])
      newIssue.hasComment = Object.keys(newIssue.comment).length == 0? false : Object.keys(newIssue.comment).length
      newIssue.hasDescription = newIssue.field.hasOwnProperty('description')? true : false
      console.log("newIssue", newIssue)
      tempIssues.push(newIssue)
    })
    console.log("tempIssues", tempIssues)
    this.agiles[agileIndex].issues = tempIssues
    console.log("prepared agiles", this.agiles)
  }

  public priorityClass(issue) {
    return issue.field.Priority[0].toLowerCase()
  }

  public manageUnstoppedItem = (item, action) => {
    console.log("manageUnstoppedItem", item)
    console.log('action', action)
    item.id = item.issueid
    if (action == 'remove') {
      this.databaseService.deleteItem(item)
      this.hideModal()
      this.dataService.timeSavedNotification('Your tracking has been removed!')      
    }
    if (action == 'resume') {
      this.agiles.filter(agile => {
        if (agile.name == item.agile) {
          agile.issues.filter(issue => {
            if (issue.id == item.issueid) {
              let unstoppedIssue = issue
              unstoppedIssue.date = item.date
              console.log(unstoppedIssue)
              this.startTracking(unstoppedIssue, item.duration)
              this.hideModal()
            }
          })
        }
      })
    }    
    if (action == 'add') {
      this.sendWorkItems(item.issueid, {date: item.date, duration: item.duration})
      this.hideModal()
    }
  }

  public hideModal() {
    document.getElementById('modal').style.display = "none"
  }

  public convertEstimate = (est) => {
    let newEst = Number(est) / 60
    if (newEst < 8) {
      return newEst + "h"
    } else if (newEst % 8 !== 0){
      return Math.floor(newEst / 8) + "d" + newEst % 8 + "h"
    } else {
      return Math.floor(newEst / 8) + "d"
    }
  }

  public sendWorkItems = (issueId, item) => {
    console.log("issueId", issueId)
    this.api.createNewWorkItem(item, issueId).then(
      response => {
        if (response["ok"]) {
          console.log("ok")
          this.dataService.timeSavedNotification('Your tracking has been saved!')
          this.dataService.timeSavedNotification('')
          this.databaseService.setIsPublished(item.date)
          this.databaseService.setIsStopped(item.date)
        }
        else {
          this.dataService.timeSavedNotification('An error occured.')
          this.dataService.timeSavedNotification('')          
        }
      }
    )
  }

  public getTimetrackingWorkTypes = (issue) => {
    let projectId = issue.id.split("-")[0]
    this.api.getTimetrackingWorkTypes(projectId).then(
      data => {
        console.log(data)
        this.workTypes = data
      }
    )
  }

  public startTracking(issue, startTime = 0, idle = 60*5) {
    let startDate = issue.date || Date.now()
    console.log("in start tracking", issue)
    console.log("startTime", startTime)
    console.log("this.timerService.currentTime", this.timerService.currentTime)
    if (this.timerService.currentTime != undefined) {
      let currentId = this.timerService.currentIssueId
      let startDate = this.timerService.startDate
      let currentTime = this.timerService.currentTime
      let stoppedTime = this.timerService.stopIssueTimer()
      this.timerService.stopTrackingNotifications()
      this.timerService.stopIdleTime() 
      if (stoppedTime >= 60) {
        // sendToApi
        this.sendWorkItems(currentId, {date: startDate, duration: currentTime })
        // stop issueTimer && saveInDb 
        this.databaseService.stopItem(stoppedTime, startDate)
        // stop idleTimer
      }
      if (issue.id == currentId) {
        // this.timerService.currentIssueId = undefined
        issue.time = 0
        return false
      }
    }
    // count
    this.currentIssueId = issue.id
    this.timerService.turnTimer(issue, startDate, startTime)
    this.timerService.startidleTime(idle)
    if (!issue.date) {
      console.log("start item")
      this.databaseService.startItem(issue, startDate)
    } else {
      console.log("update item", issue)
      console.log("startTime", startTime)
      this.databaseService.updateDuration(startTime, startDate)
      issue.date = undefined
    }
  }

}