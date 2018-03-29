import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { TimerService } from '../../../services/timer.service'
import { DataService } from '../../../services/data.service'
import { ApiService } from '../../../services/api.service'
import { WorkItemData } from 'app/models/RemoteAccount';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service'
import { AccountService } from '../../../services/account.service'
import { ToasterService} from '../../../services/toaster.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  private unstoppedItem: any
  private db: any
  public loader: boolean = true
  public preparedTimes: Array<any>
  public editingItem: object
  constructor(
    public databaseService: DatabaseService,
    private timerService: TimerService,
    private dataService: DataService,
    private api: ApiService,
    public router: Router,
    public httpService: HttpService,
    public account: AccountService,
    public toasterService: ToasterService  
  ) {
  }

  async ngOnInit() {
    this.init()
  }

  async init() {
    var current = await this.account.Current();
    this.databaseService.getAllItems(current["id"]).then(rows => {
      if (rows) {   
        this.prepareItems(rows)
      }
    })
  }
  
  public getByDaysAgo(arr, value) {
    let result = arr.filter(function(o) { 
      return o.date == value
    })
    return result? result[0] : null
  }

  public getByIssueId(arr, value) {
    let result = arr.filter(function(o) { 
      return o.issueid == value
    })
    return result? result[0] : null
  }
  
  public prepareItems(rows) {
    let that = this
    let todayItems = []
    let yesterdayItems = []
    let pastItems = []
    let currentTime = new Date();
    let preparedTimes = []
    let todayFullDate = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()

    rows.forEach(function(row) {
      let fullDate = new Date(row.date).getDate() + "/" + new Date(row.date).getMonth() + "/" + new Date(row.date).getFullYear()
      if (new Date(row.date).getMonth() === new Date().getMonth() && new Date(row.date).getFullYear() === new Date(row.date).getFullYear()) {
        if (new Date(row.date).getDate() === new Date().getDate()) {
          fullDate = "today"
        } else if (new Date(row.date).getDate() === new Date().getDate()-1) {
          fullDate = "yesterday"
        }
      }
      if (preparedTimes.length > 0) {
        let founded = preparedTimes.find(time => time.date === fullDate)
        if (founded) {
          founded.records.push(row)
        } else {
          let tasks = []
          tasks.push(row)
          preparedTimes.unshift({date: fullDate, records: tasks, summaryRecords: []})
        }
      } else {
        let records = []
        records.push(row)
        preparedTimes.push({date: fullDate, records: records, summaryRecords: []})
      }
    })
    preparedTimes.forEach((day) => {
      day.totalTime = 0
      day.records.forEach((record) => {
        day.totalTime += record.duration
      })
    })
    preparedTimes.forEach((day) => {
      day.records.forEach((record) => {
        if (parseInt(record.published)) {
          if (day.summaryRecords.length > 0) {
            let founded = day.summaryRecords.find(summaryRecord => summaryRecord.issueid === record.issueid)
            if (founded) {
              founded.subTimes.push(record)
            } else {
              let temp = Object.assign({}, record)
              record.subTimes = []
              record.subTimes.push(temp)
              day.summaryRecords.push(record)
            }
          } else {
            let temp = Object.assign({}, record)
            record.subTimes = []
            record.subTimes.push(temp)
            day.summaryRecords.push(record)
          }
        }
      })
    })
    preparedTimes.forEach((day) => {
      day.summaryRecords.forEach((record) => {
        record.summaryTime = 0
        record.subTimes.forEach((subTime) => {
          record.summaryTime += subTime.duration
        })
      })
    })
    this.preparedTimes = preparedTimes
    this.loader = false
  }

  async getIssueAndStart(issueId) {
    let account = await this.account.Current()    
    return new Promise(resolve => {
      this.api.getIssue(issueId).then(issue => {
        var newIssue : WorkItemData;
        newIssue = {
          accountId: account["id"],
          issueId: issue["id"],
          agile: issue.field.find(item => item.name == "sprint").value[0].id.split(":")[0],
          duration: 0,
          summary: issue.field.find(item => item.name == "summary" ).value,
          date: Date.now(),
          startDate: Date.now(),
          recordedTime: 0
        }
        this.timerService.startItem(newIssue)
      })
    })
  }

  public sendWorkItems = (issueId, item) => {
    this.timerService.stopItem().then(      
      (data)  => {
          this.dataService.timeSavedNotification('Your tracking has been saved!')
          this.dataService.timeSavedNotification('')
          this.databaseService.setIsPublished(item.date)
          this.databaseService.setIsStopped(item.date)
          this.init()
      }, (err) =>{
          this.dataService.timeSavedNotification('An error occured.')
          this.dataService.timeSavedNotification('')
      }
    )
  }

  public editWorkItem(editingItem) {
    let workItem = {
      date: editingItem.date,
      duration: editingItem.duration,
      description: editingItem.description
    }
    this.api.editWorkItem(editingItem.issueid, workItem, editingItem.id).then((data => {
      this.databaseService.updateDuration(workItem.duration * 60, editingItem.dateFromDb)
      this.init()
      this.hideEditIssueModal()
    }))
  }

  public deleteWorkItem(item) {
    let dbItemCreated = new Date(item.date)
    let dbItemCreatedStr = dbItemCreated.getDate() + "/"+ dbItemCreated.getMonth() + 1 + "/" + dbItemCreated.getFullYear()
    this.api.getWorkItems(item.issueid).then((workItems: Array<any>) => {
      for (let i = 0; i < workItems.length; i++) {
        let workItemCreated = new Date(workItems[i].created)
        let workItemCreatedStr = workItemCreated.getDate() + "/"+ workItemCreated.getMonth() + 1 + "/" + workItemCreated.getFullYear()
        if (item.duration === workItems[i].duration * 60 && dbItemCreatedStr === workItemCreatedStr) {
          this.api.deleteWorkItem(item.issueid, workItems[i].id).then((data) => {
            this.databaseService.deleteItem(item.date)
            this.toasterService.default('Work item has been deleted and synced with YouTrack!')
            this.init()
          }, (err) => {
            this.toasterService.error('An error occured!')
          })
        }
      }
    })
  }

  public showEditIssueModal(item) {
    let dbItemCreated = new Date(item.date)
    let dbItemCreatedStr = dbItemCreated.getDate() + "/"+ dbItemCreated.getMonth() + 1 + "/" + dbItemCreated.getFullYear()
    this.editingItem = item;
    this.api.getWorkItems(item.issueid).then((workItems: Array<any>) => {
      for (let i = 0; i < workItems.length; i++) {
        let workItemCreated = new Date(workItems[i].created)
        let workItemCreatedStr = workItemCreated.getDate() + "/"+ workItemCreated.getMonth() + 1 + "/" + workItemCreated.getFullYear()
        if (item.duration === workItems[i].duration * 60 && dbItemCreatedStr === workItemCreatedStr) {
          document.getElementById('editIssue').style.display = 'block'
          this.editingItem = workItems[i]
          this.editingItem["summary"] = item.Summary
          this.editingItem["agile"] = item.agile
          this.editingItem["issueid"] = item.issueid
          this.editingItem["dateFromDb"] = item.date
        }
      }
    })
    
  }

  public hideEditIssueModal() {
    document.getElementById('editIssue').style.display = 'none'
  }

  public goToBoards() {
    this.router.navigate(['../workspace'])
  }

}