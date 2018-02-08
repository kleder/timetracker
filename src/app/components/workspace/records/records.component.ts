import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database.service'
import { TimerService } from '../../../services/timer.service'
import { DataService } from '../../../services/data.service'
import { ApiService } from '../../../services/api.service'
import { WorkItemData } from 'app/models/RemoteAccount';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service'
import { AccountService } from '../../../services/account.service'

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  private unstoppedItem: any
  public todaySummaryItems: Array<any> = []
  private todayTimes: object = {}
  private db: any
  public loader: boolean = true
  public yesterdayTimes: object = {}
  public yesterdaySummaryItems: Array<any> = []
  public itemsFromPast: Array<any>
  constructor(
    public databaseService: DatabaseService,
    private timerService: TimerService,
    private dataService: DataService,
    private api: ApiService,
    public router: Router,
    public httpService: HttpService,
    public account: AccountService    
  ) {
  }

  async ngOnInit() {
    var current = await this.account.Current();
    this.databaseService.getAllItems(current["id"]).then(rows => {
      if (rows) {   
        this.prepareItems(rows)
      }
    })
  }

  public getItemsFromPast(items, days) {
    let temp = []
    let currentTime = (new Date()).getTime()
    let mm = new Date().getMinutes()*60*1000
    let hh = new Date().getHours()*60*60*1000
    let twoDaysAgo = new Date().getTime() - 1000 * 60 * 60 * 24 * 2;
    let pastTime = new Date().getTime() - 1000 * 60 * 60 * 24 * days;
    for (let i = 0; i < items.length - 1; i++ ) {
      let daysAgo = Math.round((currentTime - items[i].date)/(1000*60*60*24))
      if (items[i].date > pastTime && items[i].date < twoDaysAgo && items[i].status == "stop") {
        let records = []
        records.push(items[i])
        if (temp.length === 0) {
          temp.push({
            date: daysAgo + " days ago",
            records: records
          })
        } else {
          let result = this.getByDaysAgo(temp, daysAgo + " days ago")
          if (result) {
            console.log('result', result)
            // let resultt = result.records.filter(function(rec) {
            //   console.log('rec', rec)
            //   console.log('item i', items[i])
            //   return rec.issueid === items[i].issueid
            // })
            let resultt = this.getByIssueId(result.records, items[i].issueid)
            console.log('resultt', resultt)
            if (resultt) {
              resultt.duration += items[i].duration
            } else {
              result.records.push(items[i])
              // result = undefined
            }
            // result.records.push(items[i])
            
          } else {
            temp.push({
              date: daysAgo + " days ago",
              records: records
            });
          }
        }
      }
    }
    console.log('temp', temp)
    return temp.reverse()
  }
  
  public getByDaysAgo(arr, value) {
    // console.log('arr', arr)
    // console.log('value', value)
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
    console.log('rows', rows)
    let that = this
    let todayItems = []
    let yesterdayItems = []
    let pastItems = []
    rows.forEach(function(row) {
      let currentTime = new Date();
      if (new Date(row.date).getDate() == currentTime.getDate() && row.status == "stop") {
        todayItems.push(row)
      }
      if (new Date(row.date).getDate() == currentTime.getDate() - 1 && row.status == "stop") {
        yesterdayItems.push(row)
      }
    })
    console.log("todayItems", todayItems)
    if (todayItems.length == 0) {
      this.loader = false
    }
    todayItems.forEach(function(row) {
      if (!that.todayTimes.hasOwnProperty(row.issueid)) {
        that.todayTimes[row.issueid] = row.duration
      } else {
        that.todayTimes[row.issueid] += row.duration
      }
    })
    yesterdayItems.forEach(function(row) {
      if (!that.yesterdayTimes.hasOwnProperty(row.issueid)) {
        that.yesterdayTimes[row.issueid] = row.duration
      } else {
        that.yesterdayTimes[row.issueid] += row.duration
      }
    })
    this.todaySummaryItems = this.getRecordsInfo(this.todayTimes)
    this.yesterdaySummaryItems = this.getRecordsInfo(this.yesterdayTimes)
    this.itemsFromPast = this.getItemsFromPast(rows, 55)
  }

  public getRecordsInfo(times) {
    let that = this
    let summaryRecords = []
    let properties = Object.getOwnPropertyNames(times)
    console.log('times', times)
    properties.forEach(property => {
      that.api.getIssue(property).then(data => {
        let newIssue = {
          id: data["id"],
          summary: data["field"].filter(field => field.name == "summary" )[0].value,
          agile: data["field"].filter(field => field.name == "sprint" )[0].value[0].id.split(":")[0],
          todaysTime: times[property]
        }
        summaryRecords.push(newIssue)
        that.loader = false
      })
    })
    return summaryRecords
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
      }, (err) =>{
          this.dataService.timeSavedNotification('An error occured.')
          this.dataService.timeSavedNotification('')
      }
    )
  }

  public goToBoards() {
    this.router.navigate(['../workspace'])
  }

}